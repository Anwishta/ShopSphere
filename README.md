# ShopSphere

### This project has been officially accepted for SWOC and IWOC 🎉🎊

ShopSphere is a full-stack e-commerce website built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It provides users with a seamless shopping experience and includes features such as product listings, shopping cart functionality(to be implemented), secure payment integration (to be implemented), and an admin panel for managing the store (to be implemented).

<img width="960" alt="image" src="https://github.com/user-attachments/assets/d56fd721-f3d2-41ad-9126-2ba264839fc0" />


<img width="960" alt="image" src="https://github.com/user-attachments/assets/c85bbe2e-8392-4a01-8258-39de6f90c0d7" />


## Features

- **User Authentication:** Secure login and registration with encrypted user data.
- **Product Management:** Display products with details like price, description, reviews, and availability.
- **Shopping Cart:** Add, remove, and update products in real-time.
- **Search and Filter:** Find products quickly with search and filter functionalities.
- **Payment Integration:** Secure payment gateway for hassle-free transactions.
- **Order Management:** View order history, track orders, and handle returns.
- **Admin Panel:** Manage inventory, add/edit products, and track sales.
- **Mobile Responsive:** Optimized for all screen sizes.

---

## Tech Stack

- **Frontend:** React.js, CSS/TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other Tools:** Axios, Redux (or Context API),BcryptJS, JsonWebToken,  JWT Authentication and many more.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js (>=14.x)
- MongoDB
- Git

### Steps to Run the Project Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/shopsphere.git
   cd ShopSphere
   ```

2. **Install Dependencies:**
   For both FrontEnd(client) and BackEnd(server):
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the `server` folder and add the following:
   ```env
   PORT=your_localhost_url (e.g: http://localhost:3000)
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the Development Server:**
   Run the backend and frontend servers simultaneously:
   ```bash
   #Start frontend and backend concurrently
   npm run dev
   
   # Start the backend server
   cd backend
   npm run backend

   # Start the frontend client
   cd frontend
   npm run frontend 
   
   ```
Try to run both frontend and backend concurrently even if you are only interested in working with frontend for the website to run smoothly as frontend is heavily dependent on the backend

5. **Access the Application:**
   Open your browser and go to `http://localhost:3000` to see the application running. (Replace the localhost url if you are running the code somewhere else)

---

## Contributing

We welcome contributions to make ShopSphere better! To contribute:

1. Fork the repository.
2. Clone the repository into your local machine:
 ```bash
   git clone https://github.com/your-username/shopsphere.git
   ```
3. Create a new branch for your feature or bug fix:
   (There are some codes which have been commented for references you can either uncomment it and improve the code for integrating purpose or remove the commented code to make your own code)
   ```bash
   git checkout -b feature-name
   ```
5. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
6. Push your branch:
   ```bash
   git push origin feature-name
   ```
7. Open a pull request on the main repository.

---

## Project Contributers:
<a href="https://github.com/Anwishta/ShopSphere/graphs/contributors">
<img src="https://contributors-img.web.app/image?repo=Anwishta/ShopSphere"/>



## Feedback and Support

If you have any questions or feedback, feel free to open an issue or contact me at [anwishtaghosh@gmail.com].

---

### Let's build something amazing together!


