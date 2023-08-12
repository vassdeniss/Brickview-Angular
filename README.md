# Legoview - The Lego Review Site

**LegoView** - defense project for [**Angular**](https://softuni.bg/trainings/4112/angular-june-2023) course at [SoftUni](https://softuni.bg/ 'SoftUni') (June 2023).

## :pencil2: Overview

**LegoView** is a website for creating and browsing different reviews on lots of lego sets.

Users can **view / create / edit / delete** their own set collection and write reviews for thir collection if they wish to do so.

Users can also view other users collections to browse and see what sets they own.

- All users can browse the site freely.
- All authorized users have their own set collection in which they can add sets to, and write reviews for them with a built in WYSIWYG editor and optional image upload.
- Authorized users can change their username or profile picture whenever they want
- Created reviews and sets are saved for authorized users.
- Sets / reviews may be edited or deleted only by their creator.

## :performing_arts: User Types

**User** - logged-in user

- Add sets, create reviews and edit or delete them.
- Users can manage only content they created!
- Exception with their name / avatars - those can be deleted if innappropriate content is used.

**Anonymous** - users without an account

- Read all reviews / profiles on the site.

## :hammer: Built With

- Backend
  - MongoDB
    - Hosted on **Atlas**.
  - Minio
    - [Self hosted object storage](https://minio.vasspass.net) used for saving **profile pictures** / **review images**.
  - ExpressJS API
    - Built from the **ground up**.
    - **MVC architecture** with 2 models, 4 services, 4 controllers and 16 endpoints.
    - Unit test layer with **52 tests** and **80%** test coverage.
    - **Custom error handling** for all types of exceptions.
    - **Full Swagger documentation**
    - Hosted on [Render](https://legoview.api.vasspass.net/)
- Frontend
  - Built with **Angular 16**.
  - **Lazy-loaded** components for **fast performance**.
  - Service layer with **6 services**.
  - **19 components** across **6 modules**.
  - **Custom made** UI with HTML/CSS.
  - **Route guard** for unauthorized users.
  - **Resolvers** for every component.
  - **Interceptor** for **JWT tokens** and **error handling**.
  - Unit test layer with **48 tests** and **100% test coverage**.
  - Deploy to [GitHub Pages](https://legoview.vasspass.net)
- **Full CI/CD pipeline** for testing on push and deploying on pull requests.
- Full JWT system with **refresh / access tokens**.

## :camera_flash: Screenshots

## :clipboard: Test Coverage Frontend
