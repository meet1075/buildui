FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable corepack + pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

WORKDIR /home/user/nextjs-app

# Create app using pnpm
RUN pnpm dlx create-next-app@16.1.4 . --yes

# Install shadcn using pnpm
RUN pnpm dlx shadcn@2.6.3 init --yes -b neutral --force
RUN pnpm dlx shadcn@2.6.3 add --all --yes

# Move the Next.js app
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
