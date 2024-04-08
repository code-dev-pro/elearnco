[![og:image](./apps/web/public/og-image.png)](https://elearnco.io)


## Summary

- <a href="#presentation">Presentation</a>
- <a href="#structure">Project Structure</a>
- <a href="#prerequisites">Prerequisites</a>
  - <a href="#stack">The stack</a>
  - <a href="#install">Install the project</a>
  - <a href="#run">Run the Services</a>
  - <a href="#serve">Serve the Applications</a>
  - <a href="#access">Access the Applications and services</a>
  - <a href="#build">Build the Applications</a>
- <a href="#contributing">Contributing</a>
  - <a href="#commit">Commit message</a>
- <a href="#utilities">Utilities</a>
- <a href="#licence">Licence</a>

### <a id="presentation" href="#presentation">Presentation</a>

Elearnco is an open source platform for creating learning paths by simply dragging and dropping.
This is in development and it is not recommended to use it in production at this time.
⚠ WORK IN PROGRESS ⚠

### <a id="prerequisites" href="#prerequisites">Prerequisites</a>

- Node.js 20.x
- yarn
- Docker and docker-compose _(recommended)_

### <a id="stack" href="#stack">The stack</a>

- [Next.js (App router)](https://nextjs.org)
- [NextAuth](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [NextUI](https://nextui.org/)
- [Postgres](https://www.postgresql.org/)
- [Yjs](https://docs.yjs.dev/)
- [Zod](https://zod.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Resend](https://resend.com/)
- [React Email](https://react.email/)
- [framer motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)


### <a id="install" href="#install">Install the project</a>

> A global installation of [turbo](https://turbo.build/repo/docs/installing) is recommended.

```bash
# Install turbo globally
$ yarn global add turbo
```

```bash
# Clone the repository
$ git clone git@github.com:code-dev-pro/elearnco.git && cd elearnco

# Install Node dependencies
$ yarn install
```
> ⚠ For performance reasons, this project uses [Yarn](https://yarnpkg.com/). **Do not use `npm install`**. You should never have a `package-lock.json`.


## Storybook

You can use the storybook for adding or creating UI/UX components and add them to Elearnco.
![story_1](https://i.imgur.com/eXHzd9z.png)

## React Email

You can preview your emails.
![Capture d’écran 2023-11-23 à 14.59.33](https://i.imgur.com/UerdFo9.png)


### <a id="access" href="#access">Access the Applications and services</a>


- **Frontend**
  - URL: *http://localhost:3000*
- **Design System - Storybook**
  - URL: *https://localhost:6006*
- **Database - Prisma - Studio**
  - URL: *https://localhost:5555*
- **Preview Email - React Email**
  - URL: *https://localhost:3002*

### Check version packages to update

Run the following command:

```bash
yarn outdated

```

### Update version package

Run the following command:

```bash
yarn upgrade 

```

## Structure

This project under turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `database`: [Prisma](https://prisma.io/) ORM wrapper to manage & access your database
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Prisma](https://prisma.io/) for database ORM
- [Docker Compose](https://docs.docker.com/compose/) for local database

### <a id="run" href="#run">Run database</a>

We use [Prisma](https://prisma.io/) to manage & access our database. As such you will need a database for this project, either locally or hosted in the cloud.

To make this process easier, we offer a [`docker-compose.yml`](https://docs.docker.com/compose/) file to deploy a postgres server locally with a new database named `edukeasy` (To change this update the `POSTGRES_DB` environment variable in the `docker-compose.yml` file):

```bash
docker-compose up -d
```

Once deployed you will need to copy the `.env.example` file to `.env` in order for Prisma to have a `DATABASE_URL` environment variable to access.

```bash
cp .env.example .env
```

If you added a custom database name, or use a cloud based database, you will need to update the `DATABASE_URL` in your `.env` accordingly.

Once deployed & up & running, you will need to create & deploy migrations to your database to add the necessary tables. This can be done using [Prisma Migrate](https://www.prisma.io/migrate):

```bash
npx prisma migrate dev
```

If you need to push any existing migrations to the database, you can use either the Prisma db push or the Prisma migrate deploy command(s):

```bash
yarn run db:push

# OR

yarn run db:migrate:deploy
```

There is slight difference between the two commands & [Prisma offers a breakdown on which command is best to use](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push#choosing-db-push-or-prisma-migrate).

An optional additional step is to seed some initial or fake data to your database using [Prisma's seeding functionality](https://www.prisma.io/docs/guides/database/seed-database).

To do this update check the seed script located in `packages/database/src/seed.ts` & add or update any users you wish to seed to the database.

Once edited run the following command to run tell Prisma to run the seed script defined in the Prisma configuration:

```bash
yarn run db:seed
```

you can quickly have a look at the data of your local database and check if your app is working correctly with [Prisma Studio](https://www.prisma.io/studio)

```bash
npx prisma studio
```

![Data](https://i.imgur.com/3XXVb3p.png)



For further more information on migrations, seeding & more, we recommend reading through the [Prisma Documentation](https://www.prisma.io/docs/).

### <a id="build" href="#build">Build</a>

To build all apps and packages, run the following command:

```bash
yarn run build
```

### <a id="run" href="#run">Run</a>

To develop all apps and packages, run the following command:

```bash
yarn run dev
```

## <a id="contributing" href="#contributing">Contributing</a>

### <a id="commit" href="#commit">Commit message</a>

Each commit message must follow the convention [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

The command message should be structured as follows:

```plaintext
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

To make it easier, an interface will appear when commiting to create structured commit messages.

> You can find the hook for running commitizen in `.husky/prepare-commit-msg`

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

### <a id="licence" href="#licence">Licence</a>

The source code for various apps and packages in this repository are currently licensed under BSD 3-Clause. These licenses are subject to change.

