import os
import logging
import asyncio
from typing import Final
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler
from dotenv import load_dotenv

# Import our existing security service
# We need to ensure the parent directory is in sys.path if running directly
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent))

from app.services.ai_service import ai_security_service

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
BOT_USERNAME: Final = "@VigilAIGuard_bot" # Update with your bot's username

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# --- Command Handlers ---

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    welcome_text = (
        f"🛡️ *Welcome {user.first_name} to Vigil AI Guard* 🛡️\n\n"
        "I am your personal AI security assistant. Send me any suspicious link, "
        "email content, or X (Twitter) handle to analyze threats.\n\n"
        "*Commands:*\n"
        "🔗 /link <url> - Scan a suspicious link\n"
        "📧 /email <text> - Analyze email content\n"
        "🐦 /x <handle> - Assess X account risk\n"
        "📈 /status - Check security engine status"
    )
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    status_text = (
        "⚙️ *Security Engine Status*\n"
        f"🔹 *Service:* Vigil AI Layer 2\n"
        f"🔹 *OpenRouter:* {'✅ Active' if os.getenv('OPENROUTER_API_KEY') else '❌ Inactive (Fallback mode)'}\n"
        f"🔹 *VirusTotal:* {'✅ Active' if os.getenv('VIRUSTOTAL_API_KEY') else '❌ Inactive'}\n"
    )
    await update.message.reply_text(status_text, parse_mode="Markdown")

async def scan_link(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("❌ Please provide a URL. Example: `/link https://google.com`", parse_mode="Markdown")
        return
    
    url = context.args[0]
    processing_msg = await update.message.reply_text("🔍 *Scanning link for threats...*", parse_mode="Markdown")
    
    result = await ai_security_service.scan_link(url)
    await processing_msg.delete()
    
    await format_result(update, result, "Link Analysis")

async def scan_email(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("❌ Please provide the email content after the command.", parse_mode="Markdown")
        return
    
    content = " ".join(context.args)
    processing_msg = await update.message.reply_text("🧠 *Analyzing email content...*", parse_mode="Markdown")
    
    result = await ai_security_service.scan_email(content)
    await processing_msg.delete()
    
    await format_result(update, result, "Deep Email Analysis")

async def scan_x_risk(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("❌ Please provide an X handle. Example: `/x elonmusk`", parse_mode="Markdown")
        return
    
    handle = context.args[0].replace("@", "")
    processing_msg = await update.message.reply_text(f"🐦 *Assessing risk for @{handle}...*", parse_mode="Markdown")
    
    result = await ai_security_service.assess_x_risk(handle)
    await processing_msg.delete()
    
    # Custom formatting for X risk
    risk_score = result.get('suspension_risk', 0)
    risk_level = "Critical" if risk_score > 80 else "High" if risk_score > 60 else "Medium" if risk_score > 30 else "Low"
    
    emoji = "🔴" if risk_score > 60 else "🟡" if risk_score > 30 else "🟢"
    
    response = (
        f"🛡️ *Reputation Score: @{handle}*\n"
        f"{emoji} *Risk Level:* {risk_level} ({risk_score}%)\n\n"
        f"📄 *Factors:* {', '.join(result.get('risk_factors', []))}\n"
        f"💡 *Strategy:* {result.get('recommendation', 'No specific advice.')}\n\n"
        f"🔬 _Engine: {result.get('source', 'Vigil Heuristics')}_"
    )
    await update.message.reply_text(response, parse_mode="Markdown")

# --- Helper Functions ---

async def format_result(update: Update, result: dict, title: str):
    risk_level = result.get('risk_level', 'Unknown')
    risk_score = result.get('risk_score', 0)
    
    emoji = "🔴" if risk_level in ["High", "Critical"] else "🟡" if risk_level == "Medium" else "🟢"
    
    response = (
        f"🛡️ *{title}*\n"
        f"{emoji} *Risk Level:* {risk_level} ({risk_score}%)\n\n"
        f"📝 *Analysis:* _{result.get('analysis') or result.get('details') or 'No details available.'}_\n"
    )
    
    if result.get('flags'):
        response += f"\n🚩 *Indicators:* {', '.join(result.get('flags'))}"
        
    response += f"\n\n🔬 _Engine: {result.get('source', 'Vigil Internal')}_"
    
    await update.message.reply_text(response, parse_mode="Markdown")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    
    # Check if it's a link
    if text.startswith(("http://", "https://")):
        # Auto-scan link
        processing_msg = await update.message.reply_text("🔍 *Detected link. Auto-scanning...*", parse_mode="Markdown")
        result = await ai_security_service.scan_link(text)
        await processing_msg.delete()
        await format_result(update, result, "Auto Link Analysis")
    elif len(text) > 50:
        # Auto-scan long text as email
        processing_msg = await update.message.reply_text("🧠 *Detected long text. Analyzing for phishing patterns...*", parse_mode="Markdown")
        result = await ai_security_service.scan_email(text)
        await processing_msg.delete()
        await format_result(update, result, "Auto Content Analysis")
    else:
        await update.message.reply_text("❓ I'm not sure what you want me to scan. Use /link, /email, or /x commands!")

def main():
    if not TOKEN:
        print("❌ Error: TELEGRAM_BOT_TOKEN not found in environment!")
        return

    print("🚀 Vigil AI Bot starting...")
    app = Application.builder().token(TOKEN).build()

    # Commands
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("link", scan_link))
    app.add_handler(CommandHandler("email", scan_email))
    app.add_handler(CommandHandler("x", scan_x_risk))

    # Messages
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Run
    app.run_polling()

if __name__ == "__main__":
    main()
