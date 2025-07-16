# Contact Availability Card

## Overview

The Contact Availability Card is a public app card built with HubSpot's UI Extension that provides real-time availability information for contacts based on their location. This extension helps sales and support teams make informed decisions about when to contact prospects or customers by displaying:

- Current availability status (in office/out of office)
- Local time and timezone information
- Upcoming holidays in the contact's region
- Call recommendations based on availability

## Purpose

This extension addresses the common challenge of contacting prospects or customers at inappropriate times due to:
- Time zone differences
- Local holidays and observances
- Business hours variations by region
- Cultural considerations for different countries

By providing this contextual information directly within HubSpot's contact interface, teams can:
- Improve contact success rates
- Respect local customs and holidays
- Optimize call timing for better engagement
- Reduce failed contact attempts

## How It Works

### 1. Data Retrieval
The extension fetches contact information from HubSpot CRM using the following properties:
- `firstname` - Contact's first name
- `city` - Contact's city (required)
- `state` - Contact's state/province (optional)
- `country` - Contact's country (required)

### 2. API Integration
The extension calls an external API endpoint to get availability data:
```
https://uie-contact-call-availability-one.vercel.app/api/contact-availability
```

The API receives location parameters and returns:
- Current local time and timezone
- Availability status and recommendations
- Upcoming holidays in the next 30 days

### 3. Data Processing
The extension processes the API response and displays information in organized sections:
- **Local Information**: Status, location, and current local time
- **Holiday Alerts**: Upcoming holidays that might affect availability
- **Call Recommendations**: AI-generated suggestions for optimal contact timing

## Installation and Setup

## Description

This template provides a standardized introduction section for "Getting Started" with UIE public app samples. It offers a clear and concise set of instructions that can be easily embedded into the larger README files of your projects. This ensures consistency across documentation and saves developers time by eliminating the repetitive task of writing similar setup instructions.

## Usage

### Development Requirements

There are a few things that must be set up before you can make use of this project.

* You must have an active HubSpot account.
* You must have the [HubSpot CLI](https://www.npmjs.com/package/@hubspot/cli) installed and set up.
* You must install [Node.js](http://Node.js) and [yarn](https://classic.yarnpkg.com/en/).
* You should create a [developer test account](https://developers.hubspot.com/docs/getting-started/account-types#developer-test-accounts) inside of your [HubSpot developer account](https://developers.hubspot.com/docs/getting-started/account-types#developer-accounts).
* Because you’ll be using OAuth, you’ll need to set up a self-hosted backend environment to complete the OAuth process. For the purposes of this sample, it is recommended to set up the sample [OAuth Node.js app](http://Node.js) which is configured to work with the project you’ll be creating.

***Note:** You must be a super-admin for the account you want to install the app in.*

### Step 1: Install the HubSpot CLI & authenticate your account

1. Update to latest CLI version by running `npm install -g @hubspot/cli@latest`
2. Run hs init if you haven’t already done so to create a config file for your parent account. Follow the prompts, select your HubSpot account, and generate a personal access key.
3. Run `hs auth` to authenticate your account. Alternatively, select your pre-authenticated account with `hs accounts use`

### Step 2: Install app card dependencies

Change directories into the app card extensions folder and then install the node dependencies.

```
$ cd src/app/extensions
$ npm install
```

### Step 3: Upload and run your project

After installing the required dependencies, run `hs project upload` to upload your project to your HubSpot developer account. You can view the details of your public app by viewing the Apps page within your HubSpot developer account.

If you’d like to build on this project, run `hs project dev` to kick off the dev process and see changes reflected locally as you build.

#### Note

When making changes to configuration files ({CARD\_NAME}-card.json and app.json), be sure to stop the development server and use `hs project upload` to update the project before restarting the development server.

### Step 4: View the card(s)

When configuring the OAuth for this project, be sure to install the app card on a developer test account. This will allow you to configure the app card on a CONTACT record. To view the card for development, navigate to any CONTACT record and select Customize record. Select the view you'd like to update from the table and choose Add cards if you haven't customized the tabs before, follow step \#4 from [this guide](https://developers.hubspot.com/docs/platform/ui-extensions-quickstart).

![Contact Availability Card demo](https://github.com/user-attachments/assets/357b0010-461c-44fa-b4c6-ac8f38ddb734)


## Learn more about App Cards Powered by UI Extensions

To learn more about building public app cards, visit the [HubSpot app cards landing page](https://developers.hubspot.com/build-app-cards) and check out the [HubSpot public app cards developer documentation](https://developers.hubspot.com/docs/guides/crm/public-apps/quickstart).



