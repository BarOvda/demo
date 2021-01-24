const stripe = Stripe('pk_test_51HJgaRCYdV2UYrnOKjapSHIZzBVdbfpEsELDVpB4WORECydaqYov9gD5cQPx70CdvNYQ5x6X3m7iKIHvYRAXYa4T00a5NGU9S9');
const elements = stripe.elements();
var style = {
  base: {
    color: "#fff"
  }
};
const card = elements.create('card', { style });
card.mount('#card-element');
const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');
const stripeTokenHandler = token => {
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);
  form.submit();
}
form.addEventListener('submit', e => {
  e.preventDefault();
  stripe.createToken(card).then(res => {
    if (res.error) errorEl.textContent = res.error.message;
    else stripeTokenHandler(res.token);
  })
})