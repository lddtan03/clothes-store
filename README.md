# Clothes Store
This project is a full-stack e-commerce application for a clothes store, featuring a ReactJS frontend and a Laravel backend.
## Technologies Used

* **Laravel**
* **ReactJS**
* **Vite**
* **React Hook Form**
* **React Toastify**
* **MySQL**


## Getting Started

### Prerequisites

* **Composer**: Install Composer, a dependency manager for PHP.
* **XAMPP (PHP version >= 8.2.0)**: Install XAMPP to provide your Apache web server, MySQL database, and PHP environment. Ensure your PHP version is 8.2.0 or higher.
* **Git**: Install Git for cloning the repository.

### Step 1: Backend Setup (Laravel)

1.  **Clone the repository:**
    
    ```bash
    git clone https://github.com/lddtan03/clothes-store.git
    ```
2.  **Change to the project directory:**
    ```bash
    cd clothes-store
    ```
3.  **Install Composer dependencies:**

    ```bash
    composer install
    ```

4.  **Create database:**
    Create a MySQL Database with the name: `clothes_store`

### Step 2: Database Migration and Seeding

1.  **Configure `.env` file:**

    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=clothes_store
    DB_USERNAME=
    DB_PASSWORD=
    ```

2.  **Run database migrations:**

    ```bash
    php artisan migrate
    ```

3.  **Run database seeders:**

    ```bash
    php artisan db:seed
    ```

4.  **Start the Laravel development server:**

    ```bash
    php artisan serve
    ```

### Step 3: Frontend Setup (ReactJS)

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```
2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the ReactJS development server:**

    ```bash
    npm run dev
    ```

