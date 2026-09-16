# Industry Hosted Pilot — Access and Recovery Runbook

Use this procedure for the controlled Schedule pilot at:

https://industry-pilot.hummingbirdeye.chatgpt.site

## Before inviting a participant

1. Confirm the participant's email address and intended worker role directly with them.
2. A workplace manager opens **Schedule → Crew**, enters that email and role, and creates a private invitation.
3. Copy the one-time link and send it privately to the named participant. Do not post invitation links in a group chat or shared document.
4. Invitations expire after seven days. Creating a new link for the same email revokes the previous pending link.
5. The participant creates their own password. Managers and organizers must never create, request, store, or share participant passwords.

The first manager for a new pilot workplace is invited by the pilot organizer through the service-only `create_pilot_manager_invitation` database function. The browser application cannot create or claim a manager role.

## New participant enrollment

1. Open the private invitation link in a normal browser tab.
2. Confirm the workplace, email, and role displayed on the invitation card.
3. Select **Create account**, enter a name, and choose a private password.
4. If email confirmation is required, open the confirmation email and return to the same invitation link.
5. Confirm the greeting and controls match the intended person and role.

An invitation can be accepted only once, only before it expires, and only by the exact email address named on it. Workplace membership and role are assigned by the database after those checks pass.

## Participant sign-in

1. Open the live pilot URL directly in a normal browser tab. Do not use the ChatGPT Sites editing window.
2. Select **Sign in** on the Industry welcome screen.
3. Enter the email address and password chosen by the participant.
4. Confirm the greeting and controls match the intended person and role:
   - A worker sees **My Shifts** and worker schedule tools.
   - A manager sees **Team Schedule**, **Create Shift**, **Coverage Requests**, and **Crew**.
5. On a shared or temporary testing device, choose **No Thanks** when the browser offers to save the password.

Industry sign-in is separate from a ChatGPT account. If a ChatGPT confirmation screen appears, return to the direct pilot URL in a normal browser tab before troubleshooting the Industry password.

## Password recovery

1. From the Industry sign-in screen, select **Forgot password?**
2. Enter the exact email address used for the Industry account and send the reset link.
3. Open the newest reset email. Reset links are account-specific and should not be forwarded.
4. Follow the link back to Industry, choose a new password, and submit it.
5. Confirm the app opens with the correct name and role-specific controls.
6. If a reset link has expired or was already used, request a new one and use only the newest email.

## Wrong account or wrong role

1. Open Industry's **Help** panel and select **Sign out**. Signing out of ChatGPT is not required.
2. Sign in again with the intended Industry email address.
3. If the greeting is correct but the controls are not, stop testing. The pilot organizer should verify the person's workplace membership and role before the session continues.
4. Do not change a participant's role merely to get past an access problem.

## Support and recovery

- Record the time, participant, browser, screen, and visible error message. Do not record passwords or reset-link contents.
- Managers can review pending, accepted, expired, and revoked invitations in **Schedule → Crew**. They can revoke a pending invitation or create a replacement link.
- Preserve real participant data unless the organizer explicitly approves a cleanup.
- Temporary regression accounts and shifts must be clearly labeled, verified by exact ID, and removed after the test.
- Escalate repeated sign-in, recovery, role, or Realtime failures to the pilot organizer before continuing the affected workflow.

## Session completion checklist

- The participant signed in as the intended person.
- Worker and manager controls were correctly separated.
- Refresh restored the same Industry session.
- Password recovery was tested only when required.
- Temporary credentials were not saved on shared devices.
- Temporary test accounts and records were removed.
