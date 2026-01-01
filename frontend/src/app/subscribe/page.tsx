import SubscribeButton from '@/components/SubscribeButton';

export default function SubscribePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-8">Premium Subscription</h1>
      <p className="text-xl mb-12 max-w-2xl mx-auto">
        Unlock unlimited scans, advanced X monitoring, wallet risk alerts, and priority support.
        <br />
        Only ~$10/month via Superfluid streaming payment.
      </p>
      <SubscribeButton />
    </div>
  );
}