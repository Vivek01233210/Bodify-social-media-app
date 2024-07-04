import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import AlertMessage from "../Alert/AlertMessage";
import { paymentIntentAPI } from "../../APIServices/stripeAPI";

const CheckoutForm = () => {
    const [errorMessage, setErrorMessage] = useState(null);

    const { planId } = useParams();

    const paymentMutation = useMutation({
        mutationKey: ["checkout"],
        mutationFn: paymentIntentAPI,
    });

    //configure stripe
    const stripe = useStripe();
    const elements = useElements();

    //payment handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!elements) return;

        const { error: submitErr } = await elements.submit();
        if (submitErr) return;

        try {
            const mutationResult = await paymentMutation.mutateAsync(planId);
            // console.log(mutationResult);
            const clientSecret = mutationResult?.clientSecret;

            if (!clientSecret) {
                console.error("Client secret is not available.");
                return;
            }

            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: clientSecret,
                confirmParams: {
                    return_url: `${import.meta.env.VITE_BONDIFY_APP_URL}/success`,
                },
            });

            if (error) {
                console.log(error)
                setErrorMessage(error.message);
            }
        } catch (error) {
            setErrorMessage(error?.message);
        }
    };

    return (
        <div className="bg-gray-100 mt-12 h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md"
            >
                {/* Stripe payment element */}
                <div className="mb-4">
                    <PaymentElement />
                </div>

                {paymentMutation?.isPending && (
                    <AlertMessage type="loading" message="Processing please wait..." />
                )}
                {paymentMutation?.isError && (
                    <AlertMessage
                        type="error"
                        message={paymentMutation?.error?.response?.data?.message}
                    />
                )}
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Pay
                </button>
                {errorMessage && (
                    <div className="text-red-500 mt-4">{errorMessage}</div>
                )}
            </form>
        </div>
    );
};

export default CheckoutForm;