var paymentinfo={
      account_number: "account_number",
    amount: 1000,
      currency: "INR",
    mode: "UPI",
    purpose: "Conversion Stipened",
      fund_account: {
          account_type: "vpa",
          vpa: {
            address: "Upi_Id"
          },
          contact: {
              name: "",
              email: "",
              contact: "",
              type: "CAP",
              reference_id: "Acme Contact ID 12345",
              notes: {
                notes_key_1: "Tea, Earl Grey, Hot",
                notes_key_2: "Tea, Earl Grey… decaf."
              }
          }
      },
      queue_if_low_balance: true,
      reference_id: "Acme Transaction ID 12345",
      narration: "Oyesters Training",
      notes: {
          notes_key_1: "Beam me up Scotty",
          notes_key_2: "Engage"
      }
  }

 var response= await RazorPayPayout.create(paymentinfo)    
 console.log(response)  
