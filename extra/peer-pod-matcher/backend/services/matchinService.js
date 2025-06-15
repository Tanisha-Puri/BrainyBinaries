import { promises as fs } from 'fs';
     import path from 'path';
     import { findMatches } from '../../utils/matcher.js';
     import { fileURLToPath } from 'url';

     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);

     export const matchUserToPod = async (userData) => {
       try {
         console.log('Matching user with data:', userData);

         const mockDataPath = path.join(__dirname, '../../data/mockProfiles.json');
         const mockData = JSON.parse(await fs.readFile(mockDataPath, 'utf8'));
         const users = mockData || [];

         const user = users.find(u => u.name === userData.name);
         if (!user) {
           throw new Error('User not found in mock data');
         }

         const inputText = `
           Name: ${userData.name}
           Headline: ${userData.headline || 'N/A'}
           About: ${userData.about || 'N/A'}
           Skills: ${(userData.skills || []).join(", ")}
           Education: ${(userData.education || []).map(e => `${e.degree} at ${e.institution}`).join("; ")}
           Experience: ${(userData.experience || []).map(e => `${e.title} at ${e.company}`).join("; ")}
         `;

         const matches = await findMatches(inputText, null);

         const podMembers = [user, ...matches.map(m => m.profile)];
         const pod = {
           podId: `pod-${Date.now()}`,
           members: podMembers,
           interests: [...new Set(podMembers.flatMap(u => u.skills || []))],
           createdAt: new Date().toISOString()
         };

         console.log('Matched pod:', pod);
         return pod;
       } catch (error) {
         console.error('Error matching user:', error);
         throw error;
       }
     };