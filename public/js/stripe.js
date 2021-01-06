import '@babel/polyfill';
import axios from "axios";
const stripe = Stripe('pk_test_EQNA5RWei9T7DGpSohO4t5Cr000VnDIp68');
import { showAlert, hideAlert } from "./alerts"

/**  

@async 
@param tourId { string } the id of the tour. 
@description This function sends the tour id the server.
Then gets the checkout session for the user

*/
export default async function bookTour(tourId) {
    

    try {

        const res = await axios.get(
            `/api/v1/bookings/checkout-session/${tourId}`
        )

        
        await stripe.redirectToCheckout({
            sessionId: res.data?.data?.session?.id
        })

        
    } catch (error) {
         
         
         if (error instanceof Error && !error.response) {
             
             return showAlert("error", error.message)
             
         }
         if (error.response) {
             
            return showAlert("error", error?.response?.data?.message)
        }



    } finally {
    
        const alertEl = document.querySelector('.alert');

        hideAlert(alertEl)
    }



}