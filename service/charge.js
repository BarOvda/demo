const stripeConstants = require('../constants/stripeConstants.json');
const stripe = require('stripe')(stripeConstants.SECRET_KEY);
const Customer = require('../models/customer')

exports.chargeFlow = async (req, res, next) => {
    try {
        const customer = await stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            });
        //save the customer id in MongoDB
        const mongoCustomer = new Customer({
            customer_id: customer.id
        });
        const mongoResult = await mongoCustomer.save();
        if (!mongoResult)
            throw new Error('There was an error with MongoDB');
        //create new stripe subscription
        const product = await stripe.products.create({
            name: 'Subscription'
        });
        const price = await stripe.prices.create({
            unit_amount: 1,
            currency: 'usd',
            recurring: { interval: 'month', usage_type: 'metered' },
            product: product.id
        });
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: price.id }]
        });
        //create new stripe usage record
        const subscriptionItem = subscription.items.data[0];
        const usageRecord = await stripe.subscriptionItems.createUsageRecord(
            subscriptionItem.id,
            { quantity: stripeConstants.FIXED_PRICE / 10, timestamp: Math.ceil(Date.now() / 1000) }
        );
        //send the completed html page to the client
        res.render("completed.html")
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}
