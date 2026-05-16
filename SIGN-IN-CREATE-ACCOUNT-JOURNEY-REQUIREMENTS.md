# Sign In And Create Account Journey Requirements

## Purpose And Context

This prototype implements the KFC Atlas sign in and create account journey shown in the Figma storyboard. It is intended for product review, market enablement discussion, and stakeholder alignment on the expected customer flow before production implementation.

The journey demonstrates a new-user account creation path:

1. Customer enters a mobile number.
2. Customer verifies a six-digit SMS code.
3. Customer completes required account details and communication preferences.
4. Customer lands back on the signed-in home/origin page.

This is prototype-only. It does not send real SMS messages, create real accounts, connect to OAuth, or enforce production legal/privacy logic.

## Journey Map

| Step | Screen | User Action | System Behavior |
|---|---|---|---|
| 1 | Log In / Sign Up | Enter mobile number | Login CTA remains disabled until the number has at least 9 digits. |
| 2 | Verification | Enter six-digit OTP | Submit CTA remains disabled until 6 digits are entered. |
| 3 | Create Account | Enter required profile fields, accept terms, select at least one communication preference | Create Account CTA remains disabled until required inputs are complete. |
| 4 | Signed-in home/origin | Submit account form | Prototype sets the user as authenticated and returns to signed-in home. |

## Screen Requirements

### Log In / Sign Up

| Requirement | Details |
|---|---|
| Header | Top bar displays back chevron and `Log In`. |
| Title | `LOG IN / SIGN UP` in KFC heavy italic style. |
| Helper copy | `Please enter your mobile number.` |
| Field | Required mobile number field. |
| Social buttons | Google, Apple, and Facebook buttons display local logo assets and are visual only. |
| CTA | `Login`; disabled when phone input is empty or invalid, red when enabled. |
| Back behavior | Returns to home/origin context. |

### Verification

| Requirement | Details |
|---|---|
| Header | Top bar displays back chevron and `Log In`. |
| Title | `VERIFICATION`. |
| Helper copy | Confirms an SMS was sent to a masked version of the entered number. |
| OTP input | Accepts numeric input up to six digits. Empty state shows six gray dots; populated state shows the entered code. |
| Resend | `Resend Code` clears the OTP field. |
| CTA | `Submit`; disabled until six digits are entered. |
| Back behavior | Returns to Log In / Sign Up and clears the OTP. |

### Create Account

| Requirement | Details |
|---|---|
| Header | Top bar displays back chevron and `Sign Up`. |
| Title | `CREATE ACCOUNT`. |
| Required fields | First name, last name, mobile number, email address, terms/privacy consent, and at least one communication preference. |
| Optional field | Date of birth. |
| Terms copy | Includes Terms of Use and KFC Privacy Policy references. |
| Communication preferences | Email and Phone checkboxes; at least one is required. |
| CTA | `Create Account`; disabled until validation passes. |
| Submit behavior | Sets prototype authentication state and lands on signed-in home/origin page. |
| Back behavior | Returns to Verification. |

## Validation Rules

| Field | Rule |
|---|---|
| Mobile number | At least 9 digits after non-numeric characters are removed. |
| OTP | Exactly 6 digits. Any six-digit value is accepted for this new-user demo. |
| First name | Required. |
| Last name | Required. |
| Email address | Required and must match a basic email format. |
| Date of birth | Optional. |
| Terms/privacy consent | Required. |
| Communication preference | At least one of Email or Phone must be selected. |

## Out Of Scope

- Real SMS delivery or OTP verification.
- Real OAuth for Google, Apple, or Facebook.
- Backend account creation.
- Production-grade privacy, consent, or legal enforcement.
- Existing-user lookup or branching logic.
- Market-specific localization beyond the storyboard copy.

## Acceptance Criteria

| Scenario | Expected Result |
|---|---|
| Empty phone field | Login CTA is disabled. |
| Valid phone field | Login CTA is enabled and advances to Verification. |
| Empty or partial OTP | Submit CTA is disabled. |
| Six-digit OTP | Submit CTA is enabled and advances to Create Account. |
| Missing required account fields | Create Account CTA is disabled. |
| Terms unchecked | Create Account CTA is disabled. |
| No communication preference selected | Create Account CTA is disabled. |
| Valid account form submitted | User is marked signed in and lands on signed-in home/origin page. |
| Back from Verification | User returns to Log In / Sign Up. |
| Back from Create Account | User returns to Verification. |
| Social buttons tapped | Buttons remain visual only and do not advance the journey. |

