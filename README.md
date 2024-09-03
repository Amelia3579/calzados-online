# Online Shoes Store

## Description

**My Store** is a web application that allows users to manage products and shopping carts in real time through a modern and functional interface. This application uses Node.js, Express, and MongoDB, and offers features such as user registration and authentication, product management, shopping cart management, JWT and GitHub authentication, and file handling.

## Features

- **User Registration and Login:** Users can register and log in using email or GitHub authentication.
- **Product Management:** Add, edit, and delete products.
- **Cart Management:** Users can add products to their cart, update quantities, and make purchases.
- **JWT Authentication:** Route protection using JWT tokens.
- **GitHub Authentication:** Log in using your GitHub account.
- **File Handling:** Upload user documents and profiles.

## Technologies

- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** Passport.js (JWT and GitHub)
- **File Upload:** Multer
- **Templates:** Handlebars
- **Testing:** Mocha, Chai, Supertest

## Installation

1. **Clone the repository:**

   git clone https://github.com/your_username/your_repository.git

2. **Navigate to the project directory:**

   cd your_repository

3. **Install the dependencies:**

   npm install

4. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   PORT=8080
   MONGO_URI=mongodb://localhost:8080/your_database
   SECRET_WORD=your_secret_key
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=your_github_callback_url

5. **Start the application:**

   npm start

6. **Run migrations and/or seeds (if necessary):**

   npm run migrate
   npm run seed

## Usage

1. **User Registration:**

   Visit `/register` to create a new account.

2. **Login:**

   Visit `/login` to log in using your email or GitHub.

3. **Product Management:**

   Once authenticated, you can visit `/products` to view and manage products.

4. **Cart Management:**

   Visit `/cart` to view and modify your shopping cart.

5. **User Profile:**

   Visit `/profile` to view and edit your user profile.

## API Routes

- **POST /api/users/register:** Register a new user.
- **POST /api/users/login:** Log in.
- **GET /api/products:** Retrieve all products.
- **POST /api/products:** Create a new product.
- **DELETE /api/products/:id:** Delete a product.
- **GET /api/cart:** Retrieve the user's cart.
- **POST /api/cart/add:** Add a product to the cart.
- **DELETE /api/cart/:cartId/product/:productId:** Remove a product from the cart.

## Testing

To run the tests, use:

npm test

## Contributing

Contributions are welcome! Please open an issue or a pull request if you wish to contribute.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions, feel free to contact me at [your_email@domain.com](mailto:meli_gallegos@yahoo.com.ar).
