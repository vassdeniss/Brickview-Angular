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
![home-not-logged-in](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/9f621600-054a-4039-8157-6a42af185496)
![register-page](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/f4c30596-4c78-4f3c-9cfb-a2f4f38b7b13)
![example-error](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/727c9c7f-cf71-4b80-a6f1-e069ecc7b56c)
![login-page](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/37cd1d9f-19ba-4573-8ce0-fc7859c4e4ca)
![home-logged-in](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/787ff8fd-8d42-47f3-b5e1-da3da01a89f8)
![user-collection](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/bdcfd934-15e8-45da-afb2-d01a9e1da9a0)
![current-user-profile](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/6d9d4a56-16a0-47a9-b50f-3e67d41df8ec)
![current-user-profile-no-picture](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/2df41768-e7dd-45be-81d3-043eb78b218f)
![current-user-edit-profile](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/844fe461-37b5-4647-9183-0de540d68c1d)
![current-user-add-set](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/7e21502c-3384-4050-b503-f399dc1bea53)
![current-user-collection](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/856f94fd-21d0-4dfa-abf3-ecde71b30afc)
![current-user-create-review](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/a4cfa18c-0fb3-48a0-af6c-97022d61258d)
![view-review-not-owner-1](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/884a1abb-9e0e-4c8c-bf38-3aacf4e56bea)
![view-review-not-owner-2](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/75d0c3d3-78b3-4f74-a111-d82822d087e9)
![view-review-not-owner-3](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/9a2d345d-c0f4-415d-918f-3f9049b72c28)
![view-review-not-owner-4](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/273d47ab-471f-4345-b206-024ffa5d1d61)
![view-review-not-owner](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/f2c34ba2-df4a-4366-aeda-ac7d29863367)

## :clipboard: Test Coverage Frontend
![frontend-coverage](https://github.com/vassdeniss/Legoview-Angular/assets/72888249/f5941a38-a43c-424a-a9c2-47b986588859)

