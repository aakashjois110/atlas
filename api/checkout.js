const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'aud',
          product_data: { name: 'Your Product Name' },
          unit_amount: 2000, // $20.00 in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://atlastutoring.com.au/#success',
    cancel_url: 'https://atlastutoring.com.au/#pay',
  });

  res.redirect(303, session.url);
};
