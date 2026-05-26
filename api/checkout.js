const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const body = req.body || {};
  const count = parseInt(body.count) || 1;
  const total = parseInt(body.total) || 400;
  const classes = body.classes || 'Not specified';

  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'aud',
        product_data: {
          name: 'Atlas Tutoring — Term Enrolment',
          description: classes,
        },
        unit_amount: total * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    allow_promotion_codes: true,
    customer_email: body['student-email'] || undefined,
    metadata: {
      student_name: (body['student-first'] || '') + ' ' + (body['student-last'] || ''),
      student_email: body['student-email'] || '',
      student_school: body['student-school'] || '',
      student_year: body['student-year'] || '',
      parent_name: body['parent-name'] || '',
      parent_email: body['parent-email'] || '',
      parent_phone: body['parent-phone'] || '',
      classes_selected: classes,
      num_subjects: String(count),
    },
    success_url: 'https://atlastutoring.com.au/#success',
    cancel_url: 'https://atlastutoring.com.au/#pay',
  });

  res.redirect(303, session.url);
};
