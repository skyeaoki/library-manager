// /****** Form Validation ******/
//
// // when the submit button is clicked, check for errors
// submitButton.addEventListener('click', (event) => {
//
// 	/* No name error */
// 	if{
// 		nameInput.className = 'error';
// 		errorMessage.textContent += 'Please enter a name. ';
// 	}


	// /* Email Error */
	// // if email does not include "@" or is less than 6 characters add email error message
  //
	// if( emailInput.value.includes('@') == false || emailInput.value.length < 6) {
	// 	emailInput.className = 'error';
	// 	errorMessage.textContent += 'Please enter a correctly formatted email address. ';
	// }
  //
  //
	// /* No activities Error */
	// // set activitySelected to false by default
	// let activitySelected = false;
	// // if any of the checkboxes are checked, set activitySelected to true
	// for(let i = 0; i < activitiesCheckboxes.length; i++) {
	// 	if(activitiesCheckboxes[i].checked) {
	// 		activitySelected = true;
	// 	}
	// }
	// // if no activity is selected, add activity error message
	// if(activitySelected == false) {
	// 	errorMessage.textContent += 'Please select at least one activity. ';
	// 	activitiesFieldset.className = 'error';
	// }
  //
  //
	// /* Credit Card Error */
	// // if credit card option or no option is selected, check for credit card info validation
	// if(paypalOption.selected == false && bitcoinOption.selected == false) {
	// 	// if credit card number is not a number between 13 and 16 digits, add credit card number error message
	// 	if (isNaN(creditCardNumInput.value) || creditCardNumInput.value.length < 13 || creditCardNumInput.value.length > 16) {
	// 		errorMessage.textContent += 'Please enter a credit card number between 13 and 16 digits. ';
	// 		creditCardNumInput.className = 'error';
	// 	}
  //
	// 	// if zip code is not a 5 digit number, add zip code error message
	// 	if (isNaN(zipCodeInput.value) || zipCodeInput.value.length != 5) {
	// 		errorMessage.textContent += 'Please enter a 5 digit zip code. ';
	// 		zipCodeInput.className = 'error';
	// 	}
  //
	// 	// if cvv is not a 3 digit number, add cvv error
	// 	if (isNaN(cvvInput.value) || cvvInput.value.length != 3) {
	// 		errorMessage.textContent += 'Please enter a 3 digit CVV number. ';
	// 		cvvInput.className = 'error';
	// 	}
  //
	// 	// if there are any errors, prevent the form from submitting and display the error message
	// 	if(errorMessage.textContent.length > 1) {
	// 		event.preventDefault();
	// 		form.insertBefore(errorMessage, basicInfoFieldset);
  //
	// 		//scroll to top of page
	// 		document.body.scrollTop = document.documentElement.scrollTop = 0;
	// 	}
// 	// }
// });
