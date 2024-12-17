import frappe
from bakong_khqr.khqr import KHQR

@frappe.whitelist(allow_guest=True)
def api_testing():
    return "Hello, World!"

@frappe.whitelist(allow_guest=True)
def get_bakong_qr():

    # Initialize KHQR with your token from `https://api-bakong.nbc.gov.kh/register`
    khqr = KHQR("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNDZjY2NiNzRjNmYyNDU0YyJ9LCJpYXQiOjE3MzM5NzE4ODIsImV4cCI6MTc0MTc0Nzg4Mn0.bFexsmYsDLaJn08dG_iOYImsuCyJAp9PMMuCbtOkMPc")

    user_acc = 'Chhay Sokoun'
    default_amount = 100
    currency_type='KHR' # USD or KHR
    
    # Generate QR Code
    qr_code = khqr.create_qr(
        bank_account='csokoun@abaa', # Check your address under Bakong profile (Mobile App)
        merchant_name=user_acc,
        merchant_city='Phnom Penh',
        amount=default_amount, 
        currency=currency_type,
        store_label='MShop',
        phone_number='0886159728',
        bill_number='TRX019283775',
        terminal_label='Cashier-01',
    )

    # Generate MD5
    md5 = khqr.generate_md5(qr_code)

    # Check Payment
    result_transaction = khqr.check_payment(md5)

    # generate deplink
    deplink = khqr.generate_deeplink(qr_code)


    return {
            'qr_code' : qr_code,
            'md5' : md5,
            'deplink' : deplink,
            'user_acc' : user_acc,
            'amount' : default_amount,
            'currency' : currency_type,
            'is_paid' : result_transaction,
        }
    
@frappe.whitelist(allow_guest=True)
def check_is_paid():
    khqr = KHQR("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNDZjY2NiNzRjNmYyNDU0YyJ9LCJpYXQiOjE3MzM5NzE4ODIsImV4cCI6MTc0MTc0Nzg4Mn0.bFexsmYsDLaJn08dG_iOYImsuCyJAp9PMMuCbtOkMPc")
    md5 = "007ac2e4780ed7adfbc9dffce25e5248"
    transactions = khqr
    return khqr.check_payment(md5)