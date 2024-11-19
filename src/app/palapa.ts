/* This is the version that tries to run on the page itself instead of calling APIs. Much less reliable (slow + race conditions)
const palapa = async () => {
  console.log('Palapa script starting');


  const completeOrder = () => {
    window.removeEventListener('load', completeOrder);
    document.getElementById('register_first').value = 'Kyle';
    document.getElementById('register_last').value = 'Forgeron';
    document.getElementById('register_email').value = 'kyleforgeron4@gmail.com';
    document.getElementById('register_confirm_email').value = 'kyleforgeron4@gmail.com';
    document.getElementById('register_room_no').value = 2802;
    document.querySelector('[data-type="phone_no"]').value = '(617) 653-9447';
    document.getElementById('optInEmail').checked = true;
    document.getElementById('terms_privacy').checked = true;
    document.getElementById('submitCart').click();
  }

  const checkout = () => {
    window.removeEventListener('load', checkout);
    document.getElementById('btnContinue')?.click();
    window.addEventListener('load', completeOrder);
  }
  
  const addToCart = async () => {
    window.removeEventListener('load', addToCart);
    let addedToCart = false;
    const palapaBooking = Array.from(document.getElementsByClassName("row")).find(row => row.textContent?.includes('108'))?.querySelector('#bookPalapa');
    palapaBooking.style = "";
    while (!addedToCart) {
      palapaBooking.click();
      const confirmButton = document.getElementById("desktopBooking");
      const closeButton = document.getElementById("basicDialogOkBtn");
      if (!!confirmButton) {
        confirmButton.click();
        addedToCart = true;
        window.addEventListener('load', checkout);
      } else closeButton.click();
    }
  }

  const pickDay = () => {
    window.removeEventListener('load', pickDay);
    const today = new Date().getDate();
    const tomorrow = today + 1;
    document.querySelector('[data-date="' + tomorrow + '"]')?.click();
    const bookButton = document.getElementsByClassName("goToBook")[2];
    bookButton.disabled = false;
    bookButton.click();
    window.addEventListener('load', addToCart);
  }
  window.addEventListener('load', pickDay);
  console.log(document.getElementById("dashboardSeating"));
  document.getElementById("dashboardSeating").click();
}
*/
