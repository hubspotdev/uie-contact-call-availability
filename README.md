# HubSpot UI Extensions: Contact Global Availability

This repository accompanies a video series that teaches you how to build a custom HubSpot UI Extension card from scratch. The series demonstrates creating a **Contact's Global Availability Public App card** that shows real-time local time, availability status, and public holiday information directly within HubSpot contact records.

## 📺 Video Series

This project is part of a multi-part tutorial series:

- **Part 1**: [Project Setup & CLI Basics - Initial HubSpot project setup and UI Extension initialization](https://www.youtube.com/watch?v=KrqimgNb2ic)
- **Part 2**: [OAuth 2.0 & App Installation - OAuth configuration and app installation on developer accounts](https://www.youtube.com/watch?v=b1bCzozbGio)
- **Part 3**: Next.js Backend & Vercel Deployment - Building and deploying the backend API 🔜
- **Part 4**: UI Extension Development - Creating the frontend card interface 🔜

## 🎯 Project Overview

<img width="684" alt="Global Contact Availability public app card built with HubSpot's UI Extensions" src="https://github.com/user-attachments/assets/7c496e11-ed53-49d2-8863-76b3e97a770b" />

The **Contact Global Availability** app is a HubSpot Public App that creates a custom UI Extension card displaying:
- Real-time local time for contacts
- Current availability status (in/out of office)
- Public holiday information
- Next best call time recommendations

The app consists of three main components:
1. **HubSpot UI Extension** - The frontend card interface
2. **Next.js Backend API** - Handles availability logic and external API integrations

## 📁 Repository Structure

### `contact-availability/` - HubSpot UI Extension
The main HubSpot project containing the UI Extension card implementation.

- **`src/app/extensions/`** - Contains the UI Extension card components and configuration
- **`src/app/webhooks/`** - Webhook handlers for app events
- **`src/app/public-app.json`** - Public app configuration and metadata
- **`hsproject.json`** - HubSpot project configuration

*Each directory contains its own README with detailed implementation information.*

### `contact-availability-backend/` - Next.js API Backend
A Next.js application that provides the backend API endpoints for the UI Extension.

- **`app/api/`** - API route handlers for availability logic
- **`app/utils/`** - Utility functions for timezone and availability calculations
- **`public/`** - Static assets
- **`package.json`** - Dependencies and build scripts

*This directory contains its own README with API documentation and setup instructions.*

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hubspotdev/uie-contact-call-availability.git
   cd uie-contact-call-availability
   ```

2. **Follow the video series** to understand the complete implementation process

3. **Check individual directory READMEs** for specific setup instructions

## 📚 Prerequisites

- HubSpot Developer Account
- Node.js and Yarn installed
- Vercel account (for backend deployment)
- API keys for external services (Abstract Timezone API, Nager.Date)

## 🔗 Resources

- [HubSpot UI Extensions Documentation](https://developers.hubspot.com/docs/guides/crm/public-apps/overview)
- [HubSpot Developer Portal](https://developers.hubspot.com/get-started)
- [HubSpot CLI Documentation](https://developers.hubspot.com/docs/guides/crm/developer-projects/project-cli-commands)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This repository serves as a learning resource for the video series. For questions or issues related to the tutorial content, please refer to the video descriptions and resources provided in each episode.
