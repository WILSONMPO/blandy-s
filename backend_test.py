#!/usr/bin/env python3
"""
Comprehensive backend API tests for Mind Over Matter blog
Tests all endpoints at REACT_APP_BACKEND_URL/api
"""
import requests
import json
import sys
from typing import Dict, Any, List

# Backend URL from frontend/.env
BASE_URL = "https://premium-reads-15.preview.emergentagent.com/api"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "total": 0
}


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    test_results["total"] += 1
    if passed:
        test_results["passed"].append(name)
        print(f"✅ PASS: {name}")
        if details:
            print(f"   {details}")
    else:
        test_results["failed"].append(name)
        print(f"❌ FAIL: {name}")
        if details:
            print(f"   {details}")


def test_health_check():
    """Test 1: GET /api/ - health check"""
    print("\n=== Test 1: Health Check ===")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "message" in data:
                log_test("Health check", True, f"Response: {data}")
            else:
                log_test("Health check", False, f"Missing 'message' field. Got: {data}")
        else:
            log_test("Health check", False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Health check", False, f"Exception: {str(e)}")


def test_list_posts():
    """Test 2: GET /api/posts - should return >= 11 posts with camelCase fields"""
    print("\n=== Test 2: List All Posts ===")
    try:
        response = requests.get(f"{BASE_URL}/posts", timeout=10)
        if response.status_code != 200:
            log_test("List posts", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        posts = response.json()
        if not isinstance(posts, list):
            log_test("List posts", False, f"Expected array, got {type(posts)}")
            return None
        
        if len(posts) < 11:
            log_test("List posts", False, f"Expected >= 11 posts, got {len(posts)}")
            return None
        
        # Verify camelCase fields in first post
        required_fields = ["id", "slug", "title", "category", "excerpt", "cover", 
                          "date", "readTime", "featured", "editorsPick", "createdAt"]
        first_post = posts[0]
        missing_fields = [f for f in required_fields if f not in first_post]
        
        if missing_fields:
            log_test("List posts - camelCase fields", False, f"Missing fields: {missing_fields}")
        else:
            log_test("List posts", True, f"Got {len(posts)} posts with correct camelCase fields")
        
        return posts
    except Exception as e:
        log_test("List posts", False, f"Exception: {str(e)}")
        return None


def test_featured_post():
    """Test 3: GET /api/posts/featured - should return exactly 1 featured post"""
    print("\n=== Test 3: Featured Post ===")
    try:
        response = requests.get(f"{BASE_URL}/posts/featured", timeout=10)
        if response.status_code != 200:
            log_test("Featured post", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        post = response.json()
        if not isinstance(post, dict):
            log_test("Featured post", False, f"Expected object, got {type(post)}")
            return None
        
        if post.get("featured") != True:
            log_test("Featured post", False, f"Post featured field is {post.get('featured')}, expected True")
            return None
        
        if "the-quiet-revolution" in post.get("slug", "").lower():
            log_test("Featured post", True, f"Got featured post: {post.get('title')}")
        else:
            log_test("Featured post", True, f"Got featured post (different slug): {post.get('slug')}")
        
        return post
    except Exception as e:
        log_test("Featured post", False, f"Exception: {str(e)}")
        return None


def test_editors_picks():
    """Test 4: GET /api/posts?editorsPick=true - should return exactly 4 posts"""
    print("\n=== Test 4: Editor's Picks ===")
    try:
        response = requests.get(f"{BASE_URL}/posts?editorsPick=true", timeout=10)
        if response.status_code != 200:
            log_test("Editor's picks", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        posts = response.json()
        if not isinstance(posts, list):
            log_test("Editor's picks", False, f"Expected array, got {type(posts)}")
            return None
        
        if len(posts) != 4:
            log_test("Editor's picks", False, f"Expected exactly 4 posts, got {len(posts)}")
            return None
        
        # Verify all have editorsPick=true
        non_picks = [p for p in posts if not p.get("editorsPick")]
        if non_picks:
            log_test("Editor's picks", False, f"{len(non_picks)} posts have editorsPick=false")
        else:
            log_test("Editor's picks", True, f"Got exactly 4 editor's picks")
        
        return posts
    except Exception as e:
        log_test("Editor's picks", False, f"Exception: {str(e)}")
        return None


def test_category_filter():
    """Test 5: GET /api/posts?category=Mindset - should return only Mindset posts"""
    print("\n=== Test 5: Category Filter ===")
    try:
        response = requests.get(f"{BASE_URL}/posts?category=Mindset", timeout=10)
        if response.status_code != 200:
            log_test("Category filter", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        posts = response.json()
        if not isinstance(posts, list):
            log_test("Category filter", False, f"Expected array, got {type(posts)}")
            return None
        
        wrong_category = [p for p in posts if p.get("category") != "Mindset"]
        if wrong_category:
            log_test("Category filter", False, f"{len(wrong_category)} posts have wrong category")
        else:
            log_test("Category filter", True, f"Got {len(posts)} Mindset posts")
        
        return posts
    except Exception as e:
        log_test("Category filter", False, f"Exception: {str(e)}")
        return None


def test_get_post_by_slug():
    """Test 6: GET /api/posts/{slug} - test existing and non-existing slugs"""
    print("\n=== Test 6: Get Post by Slug ===")
    
    # Test existing slug
    try:
        response = requests.get(f"{BASE_URL}/posts/silent-anxiety", timeout=10)
        if response.status_code == 200:
            post = response.json()
            if post.get("slug") == "silent-anxiety":
                log_test("Get post by slug (existing)", True, f"Got post: {post.get('title')}")
            else:
                log_test("Get post by slug (existing)", False, f"Wrong slug returned: {post.get('slug')}")
        else:
            log_test("Get post by slug (existing)", False, f"Expected 200, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Get post by slug (existing)", False, f"Exception: {str(e)}")
    
    # Test non-existing slug
    try:
        response = requests.get(f"{BASE_URL}/posts/does-not-exist", timeout=10)
        if response.status_code == 404:
            log_test("Get post by slug (non-existing)", True, "Correctly returned 404")
        else:
            log_test("Get post by slug (non-existing)", False, f"Expected 404, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Get post by slug (non-existing)", False, f"Exception: {str(e)}")


def test_subscribe():
    """Test 7: POST /api/subscribe - test new email, duplicate, and invalid"""
    print("\n=== Test 7: Newsletter Subscription ===")
    
    # Test new email
    try:
        email = "test1@example.com"
        response = requests.post(
            f"{BASE_URL}/subscribe",
            json={"email": email},
            timeout=10
        )
        if response.status_code == 201:
            data = response.json()
            if data.get("status") == "subscribed":
                log_test("Subscribe (new email)", True, f"Subscribed: {email}")
            else:
                log_test("Subscribe (new email)", False, f"Expected status='subscribed', got {data.get('status')}")
        else:
            log_test("Subscribe (new email)", False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Subscribe (new email)", False, f"Exception: {str(e)}")
    
    # Test duplicate email
    try:
        response = requests.post(
            f"{BASE_URL}/subscribe",
            json={"email": email},
            timeout=10
        )
        if response.status_code == 201:
            data = response.json()
            if data.get("status") == "already_subscribed":
                log_test("Subscribe (duplicate email)", True, "Correctly returned already_subscribed")
            else:
                log_test("Subscribe (duplicate email)", False, f"Expected status='already_subscribed', got {data.get('status')}")
        else:
            log_test("Subscribe (duplicate email)", False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Subscribe (duplicate email)", False, f"Exception: {str(e)}")
    
    # Test invalid email
    try:
        response = requests.post(
            f"{BASE_URL}/subscribe",
            json={"email": "not-an-email"},
            timeout=10
        )
        if response.status_code == 422:
            log_test("Subscribe (invalid email)", True, "Correctly returned 422 for invalid email")
        else:
            log_test("Subscribe (invalid email)", False, f"Expected 422, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Subscribe (invalid email)", False, f"Exception: {str(e)}")


def test_list_subscribers():
    """Test 8: GET /api/subscribers - should include test1@example.com"""
    print("\n=== Test 8: List Subscribers ===")
    try:
        response = requests.get(f"{BASE_URL}/subscribers", timeout=10)
        if response.status_code != 200:
            log_test("List subscribers", False, f"Expected 200, got {response.status_code}: {response.text}")
            return None
        
        subscribers = response.json()
        if not isinstance(subscribers, list):
            log_test("List subscribers", False, f"Expected array, got {type(subscribers)}")
            return None
        
        emails = [s.get("email") for s in subscribers]
        if "test1@example.com" in emails:
            log_test("List subscribers", True, f"Found test1@example.com in {len(subscribers)} subscribers")
        else:
            log_test("List subscribers", False, f"test1@example.com not found in subscribers: {emails}")
        
        return subscribers
    except Exception as e:
        log_test("List subscribers", False, f"Exception: {str(e)}")
        return None


def test_posts_crud():
    """Test 9: Full CRUD for posts"""
    print("\n=== Test 9: Posts CRUD Operations ===")
    
    created_post_ids = []
    
    # CREATE: Post a new post
    try:
        new_post = {
            "slug": "test-post-unique-12345",
            "title": "Test Post for CRUD",
            "category": "Testing",
            "excerpt": "This is a test post for CRUD operations",
            "cover": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
            "date": "January 15, 2026",
            "readTime": "3 min read",
            "featured": False,
            "editorsPick": False,
            "order": 1
        }
        response = requests.post(f"{BASE_URL}/posts", json=new_post, timeout=10)
        if response.status_code == 201:
            created = response.json()
            if created.get("slug") == new_post["slug"] and "id" in created:
                created_post_ids.append(created["id"])
                log_test("Create post", True, f"Created post with id: {created['id']}")
            else:
                log_test("Create post", False, f"Response missing expected fields: {created}")
        else:
            log_test("Create post", False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Create post", False, f"Exception: {str(e)}")
    
    # CREATE: Try duplicate slug (should fail with 409)
    try:
        response = requests.post(f"{BASE_URL}/posts", json=new_post, timeout=10)
        if response.status_code == 409:
            log_test("Create post (duplicate slug)", True, "Correctly returned 409 for duplicate slug")
        else:
            log_test("Create post (duplicate slug)", False, f"Expected 409, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Create post (duplicate slug)", False, f"Exception: {str(e)}")
    
    # UPDATE: Update the title
    if created_post_ids:
        try:
            post_id = created_post_ids[0]
            update_data = {"title": "Updated Test Post Title"}
            response = requests.put(f"{BASE_URL}/posts/{post_id}", json=update_data, timeout=10)
            if response.status_code == 200:
                updated = response.json()
                if updated.get("title") == "Updated Test Post Title":
                    log_test("Update post", True, f"Successfully updated post title")
                else:
                    log_test("Update post", False, f"Title not updated. Got: {updated.get('title')}")
            else:
                log_test("Update post", False, f"Expected 200, got {response.status_code}: {response.text}")
        except Exception as e:
            log_test("Update post", False, f"Exception: {str(e)}")
    
    # CREATE: Create another post with featured=true
    try:
        featured_post = {
            "slug": "test-featured-post-67890",
            "title": "Test Featured Post",
            "category": "Testing",
            "excerpt": "This is a test featured post",
            "cover": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
            "date": "January 16, 2026",
            "readTime": "4 min read",
            "featured": True,
            "editorsPick": False,
            "order": 2
        }
        response = requests.post(f"{BASE_URL}/posts", json=featured_post, timeout=10)
        if response.status_code == 201:
            created = response.json()
            created_post_ids.append(created["id"])
            
            # Verify only one featured post exists
            featured_response = requests.get(f"{BASE_URL}/posts/featured", timeout=10)
            if featured_response.status_code == 200:
                featured = featured_response.json()
                if featured.get("slug") == "test-featured-post-67890":
                    log_test("Create featured post (exclusivity)", True, "New featured post is now the only featured one")
                else:
                    log_test("Create featured post (exclusivity)", False, f"Featured post is {featured.get('slug')}, expected test-featured-post-67890")
            else:
                log_test("Create featured post (exclusivity)", False, f"Could not verify featured post: {featured_response.status_code}")
        else:
            log_test("Create featured post", False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Create featured post", False, f"Exception: {str(e)}")
    
    # DELETE: Delete created posts
    for post_id in created_post_ids:
        try:
            response = requests.delete(f"{BASE_URL}/posts/{post_id}", timeout=10)
            if response.status_code == 200:
                log_test(f"Delete post {post_id}", True, "Successfully deleted")
            else:
                log_test(f"Delete post {post_id}", False, f"Expected 200, got {response.status_code}: {response.text}")
        except Exception as e:
            log_test(f"Delete post {post_id}", False, f"Exception: {str(e)}")
    
    # DELETE: Try deleting again (should return 404)
    if created_post_ids:
        try:
            post_id = created_post_ids[0]
            response = requests.delete(f"{BASE_URL}/posts/{post_id}", timeout=10)
            if response.status_code == 404:
                log_test("Delete post (already deleted)", True, "Correctly returned 404")
            else:
                log_test("Delete post (already deleted)", False, f"Expected 404, got {response.status_code}: {response.text}")
        except Exception as e:
            log_test("Delete post (already deleted)", False, f"Exception: {str(e)}")
    
    # RESTORE: Restore featured status on original cover story
    try:
        # Find the original "the-quiet-revolution" post
        response = requests.get(f"{BASE_URL}/posts/the-quiet-revolution", timeout=10)
        if response.status_code == 200:
            original_post = response.json()
            post_id = original_post.get("id")
            
            # Update it to be featured
            update_data = {"featured": True}
            response = requests.put(f"{BASE_URL}/posts/{post_id}", json=update_data, timeout=10)
            if response.status_code == 200:
                log_test("Restore original featured post", True, "Restored featured status on the-quiet-revolution")
            else:
                log_test("Restore original featured post", False, f"Expected 200, got {response.status_code}: {response.text}")
        else:
            log_test("Restore original featured post", False, f"Could not find original post: {response.status_code}")
    except Exception as e:
        log_test("Restore original featured post", False, f"Exception: {str(e)}")


def test_contact():
    """Test 10: POST /api/contact"""
    print("\n=== Test 10: Contact Form ===")
    try:
        contact_data = {
            "name": "Jane Doe",
            "message": "Hello, this is a test message"
        }
        response = requests.post(f"{BASE_URL}/contact", json=contact_data, timeout=10)
        if response.status_code == 201:
            data = response.json()
            if data.get("status") == "received":
                log_test("Contact form", True, f"Contact received with id: {data.get('id')}")
            else:
                log_test("Contact form", False, f"Expected status='received', got {data.get('status')}")
        else:
            log_test("Contact form", False, f"Expected 201, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Contact form", False, f"Exception: {str(e)}")


def print_summary():
    """Print test summary"""
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"Total tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])}")
    print(f"Failed: {len(test_results['failed'])}")
    
    if test_results['failed']:
        print("\n❌ FAILED TESTS:")
        for test in test_results['failed']:
            print(f"  - {test}")
    
    if test_results['passed']:
        print("\n✅ PASSED TESTS:")
        for test in test_results['passed']:
            print(f"  - {test}")
    
    print("="*60)
    
    # Return exit code
    return 0 if len(test_results['failed']) == 0 else 1


def main():
    """Run all tests"""
    print("="*60)
    print("Mind Over Matter Backend API Tests")
    print(f"Testing: {BASE_URL}")
    print("="*60)
    
    # Run all tests in order
    test_health_check()
    test_list_posts()
    test_featured_post()
    test_editors_picks()
    test_category_filter()
    test_get_post_by_slug()
    test_subscribe()
    test_list_subscribers()
    test_posts_crud()
    test_contact()
    
    # Print summary and exit
    exit_code = print_summary()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
