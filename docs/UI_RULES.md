# WebMind UI rules — proposed baseline

Status: proposal for the UI revamp. Choose a visual direction before applying its palette and typography to the app.

## Product structure

- Use the same workspace shell for Library, AI chat, Collections, and Settings. Keep navigation order and account controls stable.
- Call the saved-content area **Library** everywhere. Use **AI chat** for conversations and **Add content** for saving sources.
- Landing, authentication, pricing, and workspace screens share the same logo, fonts, colors, radii, buttons, and focus treatment. Marketing can use larger type and more space.
- Library prioritizes finding and saving. Chat prioritizes asking and checking cited sources. Keep credits and upgrades secondary to these tasks.

## Tokens

- Define semantic tokens in the existing global stylesheet and Tailwind configuration: background, surface, elevated surface, foreground, muted foreground, border, accent, accent foreground, success, warning, danger, and focus ring. Components use tokens rather than one-off hex values.
- Pick one proposed palette as the default. Design light and dark modes as a matching pair after the direction is chosen; a different direction is not a theme toggle.
- Use a 4px spacing base: 4, 8, 12, 16, 24, 32, 48, 64. Default page gutters: 24–32px desktop, 16px mobile.
- Typography: one body family, one optional display family, and monospace only for code. App body 16px/24px; secondary labels 14px/20px; metadata 12px/16px; page headings 28–32px. Marketing headings may be 40–64px. Never shrink essential UI text to fit.
- Use three chosen radius tokens consistently: controls, cards, dialogs. Reserve fully rounded shapes for tags, avatars, and explicitly pill-shaped controls.
- Use a single icon family (existing Lucide), normally 18–20px with a consistent stroke. Pair unfamiliar icons with labels.

## Layout and hierarchy

- Desktop sidebar: 224–240px. Use one page heading, one concise supporting line, and one primary action per screen.
- Limit normal content width to 1200px and reading/chat text to roughly 65–75 characters per line. Center the chat column within the workspace.
- Use cards for saved sources and bounded information. Avoid surrounding every section, label, or statistic with another card.
- Give content titles more prominence than format badges and timestamps. Show source type, title, a useful preview, and a concise origin/date.
- Support grid and list views through the same content model and component states. Keep search and source filters in predictable positions.
- At widths below 768px, move navigation into a drawer with a clearly labeled trigger. Keep current location and the primary action visible. Stack columns rather than scaling down desktop UI. Only deliberate source-filter strips may scroll horizontally.

## Components and interactions

- Reuse the existing shared Button, input, Card, dialog, toast, and shell components. Add variants there instead of styling a new button in each page.
- Buttons: primary, secondary, ghost, danger. Standard height 40px; mobile effective hit area at least 44×44px. Loading buttons retain their label and width, prevent repeat submission, and expose busy state.
- Inputs have persistent labels, a visible focus ring, error text near the field, and a clear distinction between empty, disabled, and invalid states. Placeholder text never replaces a label.
- Every interactive component has default, hover, focus-visible, active/selected, disabled, and loading states. Error, empty, success, and offline states are part of screen design.
- Show actions without requiring hover on touch devices. Icon-only actions have accessible names. Destructive actions are separated from common actions and require contextual confirmation when irreversible.
- Use toasts for brief acknowledgments; put actionable failures inline with a retry path. Do not show a success state when the request failed.
- Dialogs trap focus, close on Escape when appropriate, restore focus to their trigger, and remain usable with the mobile keyboard open.

## Chat and sources

- Keep composer position, model selection, attachment controls, and send behavior stable between empty and active chats.
- Use a labeled multiline composer. Enter sends; Shift+Enter inserts a newline. Sending supports a stop action where the streaming API permits cancellation.
- Distinguish user and assistant messages through labels and layout, not color alone. Show processing status without shifting surrounding content.
- Cite real attached/retrieved sources with links that open the relevant source. Treat citations in the design mock as sample content, never as fabricated production citations.
- State credit deductions and insufficient-credit outcomes clearly. Keep upgrade prompts outside the main conversation content.

## Accessibility, motion, and performance

- Meet WCAG AA contrast: 4.5:1 normal text, 3:1 large text; actionable boundaries and focus indicators need 3:1 against adjacent colors.
- Preserve keyboard navigation and visible focus. Use semantic headings, landmarks, labels, and live regions for meaningful async status. Never communicate status only through color.
- Honor reduced motion. Use 120–180ms control transitions and 180–240ms panel transitions; animate opacity/transform and avoid perpetual decorative motion inside the workspace.
- Render core content and actions immediately. Animation must not leave server-rendered text invisible while JavaScript loads. Reserve media dimensions to prevent layout shifts.
- Loading placeholders match the eventual layout. Preserve typed input and scroll position when recoverable requests fail.

## Review gate for each revamped screen

1. Uses shared tokens and components; no unexplained custom values.
2. Matches vocabulary, navigation, and action hierarchy across routes.
3. Works at 360px, 768px, and 1440px, plus 200% zoom.
4. Works by keyboard and has visible focus, readable contrast, and touch-sized targets.
5. Includes loading, empty, failure/retry, long-title, and insufficient-credit states where relevant.
6. Existing migration checks, route behavior, authentication, and browser tests still pass. Update tests for intentional label changes.

## Proposed visual directions

- **Paper & Ink:** off-white, dark ink, restrained blue, editorial serif headings. Quiet and reading-focused.
- **Graphite Studio (recommended):** charcoal surfaces, bright neutral text, mint accent, clean sans typography. Closest to the current brand, with clearer hierarchy and less glass.
- **Field Notes:** warm cream, forest green, terracotta, notebook-inspired organization. Personal and approachable.
- **Signal Desk:** cool white, navy, cobalt, tighter rows and more explicit structure. Best for research-heavy and professional workflows.

## Refined studies 05–08

Further exploration is in `docs/design/webmind-ui-directions-v2.html`; these are proposals, not changes to the running app.

- **Index:** warm paper, vermilion actions, an editorial feature source, and a quiet sidebar. Balanced personal knowledge workspace.
- **Commonplace:** a horizontal workspace bar, soft lavender, and mixed source cards with material cues. A creative digital desk.
- **Observatory:** opaque navy, chartreuse actions, selected navigation markers, and source-first AI chat. Recommended for developing the existing dark identity.
- **The Archive:** burgundy, literary headings, double rules, and an orderly source index. Reading and research focused.

Each study includes Library, AI chat, and landing-page views using the same palette, type choices, and component treatment within that direction.
