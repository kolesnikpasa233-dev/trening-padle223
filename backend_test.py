import requests
import sys
from datetime import datetime
import json

class PadelCenterAPITester:
    def __init__(self, base_url="https://paddel-sport.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response data preview: {str(response_data)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error response: {error_data}")
                except:
                    print(f"Error response text: {response.text}")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_get_schedule(self):
        """Test schedule endpoint"""
        success, data = self.run_test("Get Schedule", "GET", "schedule", 200)
        if success and data:
            print(f"Schedule contains {len(data)} days")
            if len(data) > 0:
                first_day = data[0]
                print(f"First day: {first_day.get('date')} with {len(first_day.get('slots', []))} slots")
        return success, data

    def test_get_reviews(self):
        """Test reviews endpoint"""
        success, data = self.run_test("Get Reviews", "GET", "reviews", 200)
        if success and data:
            print(f"Found {len(data)} reviews")
        return success, data

    def test_get_stats(self):
        """Test stats endpoint"""
        success, data = self.run_test("Get Stats", "GET", "stats", 200)
        if success and data:
            print(f"Stats: {data}")
        return success, data

    def test_create_booking(self):
        """Test booking creation"""
        # First get available schedule
        schedule_success, schedule_data = self.test_get_schedule()
        if not schedule_success or not schedule_data:
            print("❌ Cannot test booking - schedule not available")
            return False, {}

        # Find first available slot
        available_slot = None
        for day in schedule_data:
            for slot in day.get('slots', []):
                if slot.get('available', False):
                    available_slot = {
                        'date': day['date'],
                        'time': slot['time']
                    }
                    break
            if available_slot:
                break

        if not available_slot:
            print("❌ No available slots found for booking test")
            return False, {}

        booking_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "phone": "+7 (999) 123-45-67",
            "date": available_slot['date'],
            "time": available_slot['time'],
            "format_type": "open_game"
        }

        print(f"Booking data: {booking_data}")
        return self.run_test("Create Booking", "POST", "bookings", 200, booking_data)

    def test_get_bookings(self):
        """Test get all bookings"""
        return self.run_test("Get Bookings", "GET", "bookings", 200)

def main():
    print("🏓 Starting Padel Center API Tests")
    print("=" * 50)
    
    tester = PadelCenterAPITester()

    # Test all endpoints
    print("\n📡 Testing API Endpoints...")
    tester.test_root_endpoint()
    tester.test_get_schedule()
    tester.test_get_reviews()
    tester.test_get_stats()
    tester.test_get_bookings()
    tester.test_create_booking()

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed in tester.failed_tests:
            print(f"  - {failed['test']}: {failed.get('error', 'Status code mismatch')}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())