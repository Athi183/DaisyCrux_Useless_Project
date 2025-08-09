Wabi Roti 🍪
Basic Details
Team Name: DaisyCruz
Team Members
Team Lead: Athira V. - [MITS,Varikoli]
Member 2: [Anna T Jeby] - [MITS Varikoli]
Project Description
Wabi Roti is a playful React app that lets users upload a photo of their chapati/roti and analyzes its roundness and burn marks using a backend service. The app features a walking chef animation and fun feedback on your roti's perfection.

The Problem (that doesn't exist)
How do you know if your chapati is truly round and not secretly a potato? The world needs a way to judge rotis for their wabi-sabi beauty.

The Solution (that nobody asked for)
Upload your roti, and let our AI chef analyze its roundness and burns. Get instant feedback and celebrate your perfectly imperfect chapati!

Technical Details
Technologies/Components Used
For Software:

Languages: JavaScript
Frameworks: React, Vite
Libraries: framer-motion, react-router-dom
Tools: ESLint
For Hardware:

None required (unless you want to build a chapati robot!)
Implementation
For Software:

Installation
# Frontend
git clone https://github.com/DaisyCruz/WabiRoti.git
cd WabiRoti/frontend
npm install
npm run dev

# Backend
cd ../backend
pip install -r requirements.txt
python app.py
Run
- Frontend runs on localhost:5173
- Backend runs on localhost:5000
- Upload a chapati image → backend analyzes → frontend displays feedback

Project Documentation
- Frontend:
- Component structure: UploadPage, ResultPage, ChefAnimation
- Routing via react-router-dom
- Animation logic using framer-motion
- Backend:
- Flask API with /upload endpoint
- Image analysis pipeline using OpenCV
- Roundness detection via contour approximation
- Burn detection via pixel intensity thresholding
- Feedback Logic:
- Based on roundness score and burn percentage
- Generates quirky comments like “Almost a pizza!” or “Michelangelo would be proud!”

Screenshots
!Screenshot1<img width="1920" height="1080" alt="Screenshot 2025-08-09 054607" src="https://github.com/user-attachments/assets/d05147f2-b700-42cf-88dc-bbccb2b4f3f0" />
<img width="1846" height="929" alt="unnamed" src="https://github.com/user-attachments/assets/3aecf57b-6345-457a-9c3d-4a2de96e263d" />

 Chef animation and upload interface

!Screenshot2 Sample chapati image used for analysis

![chap](https://github.com/user-attachments/assets/228857d7-50ec-4268-9897-379bd55646fc)

!Screenshot3 Animated chef walking across the screen
<img width="1920" height="1080" alt="Screenshot 2025-08-09 054607" src="https://github.com/user-attachments/assets/a64533c8-e2ea-4d8a-a0b5-689d08be93dd" />

Diagrams
![Workflow](Add your workflow/architecture diagram here) Frontend (React) → Backend (Flask API) → Image Analysis → Results Page

Project Demo
Video
[Add your demo video link here] Shows chef animation, upload, and result feedback

Additional Demos
[Add any extra demo materials/links]
![Uploading chap.jpg…]()

Team Contributions
Anna T Jeby: Frontend, animation, UI/UX
[Athirs : Backend, image analysis
[Name 3]: Documentation, testing
Made with ❤️ at TinkerHub Useless Projects

<img alt="Static Badge" src="https://img.shields.io/badge/TinkerHub-24?color=%23000000&amp;link=https://www.tinkerhub.org/">
<img alt="Static Badge" src="https://img.shields.io/badge/UselessProjects--25-25?link=https://www.tinkerhub.org/events/Q2Q1TQKX6Q/Useless%20Projects">
