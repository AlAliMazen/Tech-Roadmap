# Tec-Roadmap Tests

## Manual Testing of Website Functionality

The following tests were conducted manually on the deployed version of the website to ensure that key features and user interactions function as expected. These tests focus on essential actions such as user authentication, navigation, and content interaction. Each test case was executed to validate the system's response, and all outcomes were verified as successful.
Here’s a detailed table for the functionality testing:

- [Tec-Roadmap Tests](#tec-roadmap-tests)
  * [Manual Testing of Website Functionality](#manual-testing-of-website-functionality)
    + [Sign In / Sign Up](#sign-in---sign-up)
    + [Navbar](#navbar)
    + [Adding Article Functionality](#adding-article-functionality)
    + [Category Functionality Testing](#category-functionality-testing)
    + [Course Component Testing](#course-component-testing)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>



### Sign In / Sign Up

| Test Case | Description | Expected Result | Outcome |
|---|---|---|---|
| **Invalid Login Attempt** | When a user attempts to log in without an account, a notification will appear indicating the data entered is not valid or does not exist. | A warning message will appear under the input fields stating "Invalid credentials" or "Account not found." | Pass |
| **Unaccepted Username Characters** | If a user tries to sign up using a username with unaccepted characters, a notification will appear specifying the invalid characters. | A validation message indicating the username contains unaccepted characters will be displayed. | Pass |
| **Successful Logout** | Upon logging out, the user will be redirected to the Home page automatically. | User is logged out and redirected to the Home page. | Pass |

### Navbar

| Test Case | Description | Expected Result | Outcome |
|---|---|---|---|
| **Logo Navigation** | Clicking the website's logo from any page should redirect the user back to the Home page. | User is taken to the Home page upon clicking the logo. | Pass |
| **Conditional Navbar Features for Logged-in Users** | Only logged-in users should see options like "Add Article," "Add Category," and "View Feeds and Likes" in the navigation bar. Visitors do not have access to these features. | Logged-in users see additional options in the Navbar; visitors do not. | Pass |

### Adding Article Functionality

The following manual tests were conducted to verify the behavior of the "Adding Article" feature on the deployed version of the website. Each test focused on specific interactions related to adding, viewing, editing, and deleting articles, ensuring a smooth user experience for logged-in users.

| Test Case | Description | Expected Result | Outcome |
|---|---|---|---|
| **Input Field Validation** | When any of the input fields (e.g., title, category, content, image) are not filled, a notification appears under the corresponding field indicating the error. | Notification displayed under the field causing the error. | Pass |
| **Article Content Accordion** | Clicking on the article title triggers the accordion to open, displaying the content. | Accordion opens to display the article content. | Pass |
| **Edit/Delete Options for Own Article** | When viewing my own article, the dropdown menu shows options for Edit and Delete. | Dropdown with Edit and Delete options visible. | Pass |
| **View Own Article's Comments** | Only the comments associated with my own article are visible when I view it. | Only related comments are displayed. | Pass |
| **Delete Article** | Deleting an article removes all associated comments and decrements the article count. | Article and all related comments are deleted, and post count is decremented. | Pass |
| **Update Article Timestamp** | When updating my article, the timestamp is automatically updated to reflect the latest changes. | Timestamp is updated. | Pass |



### Category Functionality Testing

These manual tests were conducted on the deployed version of the website. The tests focus on validating the behavior of the **Category** dropdown menu, which is essential for classifying articles and courses.

| Test Case | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **1. Input Field Validation** | When either the category name or content is missing during the addition of a category, a notification should appear underneath the field that caused the error. | Notification appears, indicating the missing field. | Notification shown for the missing field. | Pass |
| **2. Article Category Display** | Each article must have an associated category that is displayed next to the article title on the Home page. | Category is displayed next to each article title on the Home page. | Category correctly shown for each article. | Pass |
| **3. Course Category Display** | Each course must have an associated category that is displayed next to the course title on the Course page. | Category is displayed next to each course title on the Course page. | Category correctly shown for each course. | Pass |

These tests ensure that the category dropdown and the display of categories are working as expected across both articles and courses.

### Course Component Testing

**Introduction:**  
The following manual tests were conducted on the deployed version of the Tech-Roadmap-DRF application to validate the functionality of the course component. Currently, courses can only be created from the backend by the admin. However, logged-in users can interact with the courses by enrolling, reviewing, and rating them from the front end.

| Test Case | Description | Expected Result | Actual Result |
|---|---|---|---|
| **1. Course Details Display** | Course is shown on the "Courses" page with its creator, creation date, a thumbnail image, enrollment count, rating average, and the number of reviews. | Course details and statistics should display correctly. | Pass |
| **2. Expand Course Information** | Clicking on the course title triggers the accordion element to expand and display the course's description. | Accordion expands and shows the course description. | Pass |
| **3. Enroll in a Course** | When a logged-in user clicks to enroll in the course, the number of enrollments is incremented, and the page reloads to reflect the change. | Enrollment count should increase, and the page reloads with the updated count. | Pass |
| **4. Un-enroll from a Course** | If a logged-in user is enrolled, they can un-enroll by clicking the un-enroll icon, which decrements the enrollment count and updates the icon. | Enrollment count should decrease, and the icon should update accordingly. | Pass |
| **5. View Course Reviews** | Clicking on the Reviews or Rating icon redirects the user to the course page, where all reviews are displayed. | The user is redirected to the course page and can view all reviews. | Pass |
| **6. Submit a Review and Rating** | A logged-in user can write a review and provide a rating for the course on the course page. | The user should be able to submit a review and rating, which are reflected on the course page. | Pass |
| **7. Update or Delete Review** | If the logged-in user owns the review, they can either delete or update the review content. | The user can successfully update or delete their review. | Pass |
| **8. One-Time Course Interaction** | A logged-in user can only rate, review, and enroll in a course once. Multiple interactions for these actions are restricted. | The user can perform these actions only once per course. | Pass |

This table highlights the course-related features tested, ensuring the user experience is smooth and that all critical functionality around enrollment, reviews, and ratings works as expected.

Here’s a more precise version of the profile page test cases:

| **Test Case** | **Description** | **Expected Result** | **Result** |
|---|---|---|---|
| **Viewing Profile Statistics** | When a visitor clicks on a user profile, the profile displays the number of posts, followers, people they are following, and course enrollments. | The profile page shows correct counts for posts, followers, following, and enrollments. | Pass |
| **Visitor Restrictions on Following** | When a visitor views a profile page, they do not have the option to follow that user. | The follow button is not visible to visitors who are not logged in. | Pass |
| **Logged-in Users Following** | Only logged-in users can follow another user from the profile page. | The follow button is visible and functional only for logged-in users. | Pass |

Let me know if you'd like to add more details!