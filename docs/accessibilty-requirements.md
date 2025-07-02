# Accessibility Audit Report

This report is broken down into three sections, covering the core components of your website.

---

### **1. HTML: Semantic Structure & Screen Reader Experience**

The HTML provides a solid foundation, but it's missing key information that screen readers need to understand the interactive elements.

* **Strengths:**
  * **Good Document Structure:** You're using `<header>`, `<main>`, `<nav>`, and `<footer>` correctly, which creates a clear and logical structure for assistive technologies.
  * **Language Declaration:** The `<html lang="en">` attribute is correctly set, ensuring screen readers use the right pronunciation.
  * **Descriptive Title:** The `<title>` tag is clear and descriptive.

* **Areas for Improvement:**
  * **Unlabelled Controls (High Priority):** The hamburger (☰) and close (×) buttons have no text or labels. A screen reader will likely announce them as "button" or "times," which is meaningless.
    * **Recommendation:** Add `aria-label` attributes to describe their function, for example: `<button id="menu-toggle" aria-label="Open navigation menu">`.
  * **Missing Relationships (Medium Priority):** There's no programmatic link between the hamburger button and the navigation panel it controls.
    * **Recommendation:** Use `aria-controls="posts-list"` on the toggle button to link it to the panel.
  * **Content Not Hidden (Medium Priority):** When the mobile menu is open, a screen reader can still access the main article content underneath. This can be very confusing.
    * **Recommendation:** The navigation panel should have `aria-hidden="true"` by default, and this should be toggled with JavaScript.

### **2. CSS: Visual Accessibility & Readability**

The visual design is clean, but several issues will make it difficult for users with visual impairments to use the site effectively.

* **Strengths:**
  * **Responsive Design:** The layout adapts to different screen sizes, which is a huge win for accessibility.
  * **Scalable Fonts:** Using `rem` units for font sizes allows users to adjust the text size in their browser without breaking the layout.

* **Areas for Improvement:**
  * **Poor Color Contrast (High Priority):** This is the most critical issue. The primary theme color (`#5d9c9c`) used for headings, links, and active tags has a very low contrast ratio against the light background. This fails WCAG AA/AAA standards and will be unreadable for many users with low vision.
    * **Recommendation:** Darken the `--color-primary` and `--color-primary-medium` variables in your CSS to achieve a contrast ratio of at least **4.5:1**.
  * **Invisible Focus States (High Priority):** There are no custom `:focus` styles. This means keyboard users have no clear visual indicator of which element they are currently on, making navigation nearly impossible.
    * **Recommendation:** Add a highly visible `:focus` style for all interactive elements (links, buttons). A thick, contrasting outline is a common and effective solution.
  * **Links Identified by Color Only (Medium Priority):** In the article content, links are only differentiated by their color. This makes them invisible to users with color blindness.
    * **Recommendation:** Add a persistent `text-decoration: underline;` to all links within the `article#post-content` section.

### **3. JavaScript: Interactivity & Focus Management**

The JavaScript makes the site dynamic, but it currently creates major barriers for keyboard-only users.

* **Strengths:**
  * The menu toggle logic is functional for mouse users.
  * The menu correctly closes when a post is selected, which is good design.

* **Areas for Improvement:**
  * **No Focus Management (High Priority):** This is a critical failure for keyboard accessibility.
        1. **When the menu opens,** focus is not moved into it. A keyboard user has to tab through the entire page to reach the menu.
        2. **When the menu closes,** focus is not returned to the hamburger button. It's lost, and the user is sent back to the top of the page.
    * **Recommendation:** Update the JavaScript to programmatically move focus to the close button when the menu opens, and back to the hamburger button when it closes.
  * **No Focus Trapping (High Priority):** When the menu is open, a keyboard user can tab "behind" it into the main content area. The focus becomes lost on invisible elements.
    * **Recommendation:** Implement a "focus trap" in JavaScript that keeps the user's focus locked inside the open menu until they explicitly close it.

---

### **Summary of Recommendations**

To make your site truly accessible, I recommend focusing on these three key areas in order:

1. **Fix the color contrast** to ensure everyone can read your content.
2. **Implement proper focus management** in the JavaScript for the off-canvas menu.
3. **Add highly visible focus styles** in the CSS for all interactive elements.

Addressing these issues will resolve the most significant barriers and dramatically improve the experience for users with disabilities.
