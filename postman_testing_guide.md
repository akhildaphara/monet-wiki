# How to Test the Secured API with Postman

Now that the API is secured with a Google JWT Authorizer, you must provide a valid Google `idToken` with every request. This guide explains how to get a temporary token and use it to make authorized requests from Postman.

---

### Step 1: Obtain a Google `idToken`

The `idToken` is a short-lived credential (usually valid for 1 hour). You will need to get a new one for each testing session. Here are two methods to do so.

#### Method A: Get the Token from the iOS App (Easiest Method)

This is the most straightforward approach since your app already handles Google Sign-In.

1.  **Open the Project in Xcode**: Navigate to the `Monet` project.
2.  **Edit the Sign-In Service**: Open the file `MonetApp/Services/GoogleSignInService.swift`.
3.  **Add a Print Statement**: Locate the `signIn` function. Inside the `if let idToken = ...` block, add a line to print the token to the console.

    ```swift
    // MonetApp/Services/GoogleSignInService.swift

    func signIn() {
        // ... previous code ...
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { [weak self] result, error in
            // ...
            if let user = result?.user {
                if let idToken = user.idToken?.tokenString {
                    // --- Add these lines to log the token ---
                    print("--- bearer token---")
                    print(idToken)
                    print("-----------------------")
                    // -----------------------------------------

                    APIClient.shared.authToken = idToken
                    // ...
                }
            }
        }
    }
    ```

4.  **Run the App**: Build and run the app on a simulator or a physical device.
5.  **Sign In**: Go through the Google Sign-In flow within the app.
6.  **Copy the Token**: Look in the Xcode debug console. You will see the `idToken` printed. It is a very long string of characters. Copy this entire string.

#### Method B: Use Google's OAuth 2.0 Playground

This web tool is designed for API testing and can generate tokens directly.

1.  **Navigate to Playground**: Open the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).
2.  **Configure OAuth**: Click the gear icon (**OAuth 2.0 configuration**) on the right side.
    *   Check the box for **"Use your own OAuth credentials"**.
    *   Provide your **OAuth Web Client ID** and **Client Secret**. If you don't have one for a web application, you will need to create one in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
3.  **Select Scopes**: In the main "Step 1" section, find and authorize the following scopes:
    *   `https://www.googleapis.com/auth/userinfo.email`
    *   `https://www.googleapis.com/auth/userinfo.profile`
    *   `openid`
4.  **Authorize**: Click **"Authorize APIs"** and sign in with your Google account.
5.  **Exchange for Tokens**: In "Step 2", click **"Exchange authorization code for tokens"**.
6.  **Copy the `id_token`**: The response will contain an `id_token`. Copy this value.

---

### Step 2: Use the Token in Postman

With the `idToken` copied, you can now make authorized requests to your API.

1.  **Create a Request**: Open Postman and set up a new request with the correct method (`GET`, `POST`, etc.) and URL for your endpoint (e.g., `https://<your-api-id>.execute-api.us-east-1.amazonaws.com/v1/categorize?name=starbucks`).
2.  **Set Authorization**: Go to the **Authorization** tab.
3.  **Select Bearer Token**: From the **Type** dropdown menu, choose **Bearer Token**.
4.  **Paste the Token**: In the **Token** input field on the right, paste the `idToken` you copied in Step 1.

    ![Postman Bearer Token Configuration](https://i.imgur.com/8d2ZJkL.png)

5.  **Send Request**: Send your request. Postman will automatically include the necessary `Authorization: Bearer <your_token>` header.

---

### Troubleshooting

-   **`401 Unauthorized` Error**: If you receive a `401` or `403` error, your token has likely expired. Simply repeat Step 1 to get a new token and update it in Postman. Also, ensure you have copied the entire token string without any extra spaces or characters.
