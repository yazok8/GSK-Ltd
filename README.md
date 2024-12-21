# Next.js + Prisma + TailwindCSS Platform

GSK-LTD is a modern platform specializing in a diverse range of food products, including grains and spices. The website offers a responsive and engaging user experience, leveraging cutting-edge technologies to ensure efficiency and scalability.

## Features

- 🔐 **Authentication** - Secure user management with NextAuth.js
- 🛍️ **Product Management** - Full CRUD operations with Prisma ORM
- 🖼️ **Image Uploads** - Cloud storage with AWS S3
- 📱 **Responsive Design** - Mobile-first UI with Tailwind CSS
- 📧 **Transactional Emails** - Automated emails with React Email
- 📊 **Analytics** - Performance monitoring with a watcher

## Tech Stack

- **Framework:** Next.js 13+
- **Database:** Prisma with PostgreSQL
- **Authentication:** NextAuth.js
- **UI:** Tailwind CSS, Radix UI
- **Payments:** Stripe
- **Email:** emailjs
- **Monitoring:** Watcher
- **Storage:** AWS S3

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- TailwindCSS
- MongoDB
- AWS account (for S3)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-prisma-ecommerce.git
   cd nextjs-prisma-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```plaintext
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   AWS_ACCESS_KEY_ID="..."
   AWS_SECRET_ACCESS_KEY="..."
   AWS_S3_BUCKET_NAME="..."
   ```

5. Initialize the database:
   ```bash
   npm run db:push
   ```

### Development

Start the development server:
```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to view the application.

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js 13+ app directory
├── components/       # React components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── prisma/          # Database schema and migrations
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://radix-ui.com)
- [Stripe](https://stripe.com)