const submit = document.getElementById("submit");
const responseField = document.getElementById("response");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");
const loading = document.getElementById("spinner");

let promptResponses = [];

//Our call to the API
const generateResponse = async () => {
  //Get the user input field value
  //Set loading spinner
  loading.classList.remove("visually-hidden");
  submit.classList.add("visually-hidden");
  const input = userInput.value;
  const response = await fetch("/chat", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Generate a short answer in text to the question at the botton of this text, in context of the helpdesk article pasted next. Helpdesk article:
      Welcome to GlimmerHaven, a premier destination for an enchanting shopping experience. Nestled at the heart of the city, GlimmerHaven is more than just a department store – it's a realm of elegance and style. Our store transcends traditional retail, offering a curated selection of fashion, beauty, home essentials, and innovative tech gadgets that cater to your every desire. With luxurious interiors adorned with sparkling chandeliers and lush greenery, GlimmerHaven is a haven where shopping dreams come true. Explore our meticulously crafted departments, each designed to immerse you in a world of timeless sophistication and contemporary trends. Elevate your shopping journey at GlimmerHaven, where every visit is a step into a realm of sheer opulence and boundless inspiration.
Q: What are the store hours?
A: Our store opens at 9:00 AM and closes at 9:00 PM from Monday to Saturday. On Sundays, we open at 10:00 AM and close at 7:00 PM.

Q: How can I place an online order?
A: You can easily place an online order by visiting our website, selecting the desired items, adding them to your cart, and proceeding to checkout.

Q: What payment methods do you accept?
A: We accept credit/debit cards (Visa, MasterCard, American Express), PayPal, and mobile payment options like Apple Pay and Google Pay.

Q: Can I return or exchange an item I purchased?
A: Yes, we have a flexible return and exchange policy. Items can be returned within 30 days of purchase with a valid receipt for a refund or exchange.

Q: Is there a loyalty rewards program?
A: Absolutely! Our loyalty program offers exclusive discounts, early access to sales, and points for every purchase that can be redeemed for future discounts.

Q: How do I track my order?
A: After your online order is processed, you'll receive a tracking number via email. You can use this number to track the status of your delivery.

Q: Do you offer gift wrapping services?
A: Yes, we provide complimentary gift wrapping for purchases made in-store. You can also opt for gift wrapping during online checkout for a small fee.

Q: Can I check product availability in my local store?
A: Certainly! You can use our website to check the availability of specific products in your nearest store by using the "Check In-Store Availability" feature.

Q: What's your price matching policy?
A: We offer price matching within 14 days of purchase. If you find the same item at a lower price in a local competitor's store, we'll match that price.

Q: How can I contact customer support?
A: You can reach our customer support team by calling our toll-free number, sending an email to support@departmentstore.com, or using the live chat feature on our website during business hours.

Question: ${input} `
      }],
      temp: 0.6,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  const message = responseData.result[0].message.content;
  //console.log(message);

  //Store our previous messages
  promptResponses.push({ question: input, response: message });

  //Clear both fields
  userInput.value = "";

  const historyElement = document.createElement("div");
  historyElement.innerHTML = `<li class="list-group-item">Prompt: ${input}</li>
    <li class="list-group-item"> Response: ${message}</li>`;
  chatHistory.append(historyElement);

  //Stop loading spinner
  loading.classList.add("visually-hidden");
  submit.classList.remove("visually-hidden");
};

//Assign onclick method
submit.onclick = generateResponse;
