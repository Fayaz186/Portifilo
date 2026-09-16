# Security Specification & Threat Model for Abdul Razaq Hilal Portfolio

## 1. Data Invariants
- **Public Read Access**: Public visitors can read portfolio content (profile, experiences, education, skills, projects, research, articles, media, achievements).
- **Admin-Only Mutations**: Public visitors cannot create, update, or delete portfolio content. Only the authenticated administrator (`fayazmalikzai055@gmail.com` or verified admin document in `/admins/{adminId}`) can perform write mutations.
- **Inquiry Creation Guard**: Public visitors can submit contact messages to `/messages/{messageId}`, but must conform strictly to size and type constraints (`senderName` <= 100, `senderEmail` <= 150, `message` <= 3000, `read == false`). Public visitors cannot read or list messages submitted by others.
- **Message Confidentiality**: Only the authenticated administrator can list, read, update (`read: true`), or delete contact inquiries.
- **Document ID Poisoning Protection**: All document IDs must satisfy `isValidId(id)` (alphanumeric, dashes, underscores, max length 128) to prevent path injection attacks.
- **Strict Key Integrity**: Document writes must not contain unauthorized extra properties or shadow fields.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Project Deletion**: Anonymous attacker sends `DELETE /projects/proj-telemedicine`.
2. **Unauthenticated Profile Overwrite**: Anonymous attacker attempts `SET /content/profile` with malicious URL.
3. **Public Message Harvesting**: Unauthenticated visitor attempts `GET /messages` or `LIST /messages`.
4. **ID Poisoning Attack**: An attacker attempts to create an experience with a 2KB junk character document ID `experiences/%%%$$$###invalid`.
5. **Shadow Field Injection**: Non-admin attempts to create a project with shadow admin rights `{ id: 'proj-hack', title: 'X', category: 'web', isAdmin: true }`.
6. **Message Self-Read Flaw**: Visitor tries to read back the messages collection.
7. **Email Spoofing Attack**: Attacker attempts to update profile claiming an unverified admin email.
8. **Denial of Wallet Payload**: Attacker attempts to post a 50MB message string to `/messages`.
9. **Research Paper Modification**: Attacker attempts to modify citations or DOI on `/research/paper-1`.
10. **Admin Privilege Escalation**: Non-admin user creates a record inside `/admins/attackerUid`.
11. **Article Defacement**: Attacker attempts `UPDATE /articles/art-pashto-nlp` without admin credentials.
12. **Public Visitor Education Deletion**: Attacker attempts `DELETE /education/edu-kabul-univ`.

## 3. Test Runner Reference (firestore.rules.test.ts)
The test runner asserts that all unauthenticated write requests to portfolio collections, unauthenticated reads to messages, and privilege escalations to `/admins` result in `PERMISSION_DENIED`.
