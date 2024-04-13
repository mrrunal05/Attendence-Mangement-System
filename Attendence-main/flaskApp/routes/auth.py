from flask import request, jsonify, render_template
from config.con_mongodb import con
from werkzeug.security import generate_password_hash, check_password_hash
from flaskApp.utils import generate_authtoken, send_gmail
from dotenv import load_dotenv
import os
import threading
load_dotenv()




myClient = con()
myCol = myClient['Users']

securityKey = os.getenv('SECURITY_KEY')

#route to register user and send otp
def signup():
    try:
        _json = request.json
        name = _json.get('name')
        email = _json.get('email')
        password = _json.get('password')

        query = {'email': email}
        existing_document = myCol.find_one(query)
        if existing_document:
            resp = jsonify({'message': 'User already existing', 'status': False})
            return resp
        else:
            sender_email = os.getenv("sender_email")
            gmailpassword = os.getenv("password")
            recipient_email = email
            otp = int(send_gmail.generate_otp())
            subject = 'Your OTP Code'
            body = f'Your OTP code is: {otp}'
            send = send_gmail.send_otp_email(sender_email, gmailpassword, recipient_email, subject, body)

            if send:
                hash_password = generate_password_hash(password,method='sha256')
                countD = myCol.count_documents({})
                
                isId = True
                while isId:
                    if not myCol.find_one({'_id': countD}):
                        isId = False
                    else:
                        isId = True
                        countD = countD + 1
                        
                # token = generate_authtoken.generate_token(countD,securitykey)
                myCol.insert_one({"_id": countD, "name": name, "email": email, "password": hash_password, "createClass":[], "joinedClass": [], "otp": otp, "isEmailVerify": False})
                timer_thread = threading.Timer(300.00,checkVerify,args=(countD,None))
                timer_thread.start()
                resp =  jsonify({'message': 'OTP sent successfully!', "status": True})
                resp.status_code = 200
                return resp
            else:
                return jsonify({'message': 'Failed to send OTP', "status": False})
    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}")
        return resp
    
def checkVerify(id,arg2):
    user = myCol.find_one({'_id': id})
    if user['isEmailVerify']:
        pass
    elif not user['isEmailVerify']:
        deleteUserbyId(id)
        
        
#route for virefy otp
def verifyOtp():
    try:
        _json = request.json
        email = _json.get('email')
        user_otp = _json.get('user_otp')
        user = myCol.find_one({'email': email})

        if not user['isEmailVerify']:
            if user['otp'] == user_otp:
                filter_criteria = {"_id": user['_id']}
                update_query = {"$unset": {"otp": 1},
                                "$set": {"isEmailVerify": True}}
                myCol.update_one(filter_criteria, update_query)
                id = user['_id']
                authToken = generate_authtoken.generate_token(id,securityKey,None)
                data = {
                        "authToken": authToken,
                        "status": True
                        }
                resp = jsonify(data)
                resp.status_code = 200
                return resp
            else:
                resp = jsonify({'message': 'OTP incorrect', "status": False})
                resp.status_code = 200
                return resp
        else:
            resp = jsonify({'message': 'User already verified', "status": False})
            resp.status_code = 200
            return resp
            
    except:
        resp = jsonify({"message": 'Authentication failed (user not found)', "status": False})
        resp.status_code = 200
        return resp
    
#route for get all users
def getAllData():
    try:
        users =  list(myCol.find())
        resp = jsonify(users)
        resp.status_code = 200
        return resp
    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}")
        return resp

#rout for authenticating a user
def signin():
    try:
        _json = request.json
        email = _json.get('email')
        password = _json.get('password')
        user = myCol.find_one({'email': email})
        isEmailVerify = user['isEmailVerify']
        if user:
            if isEmailVerify:
                if check_password_hash(user['password'], password):
                    id = user['_id']
                    authToken = generate_authtoken.generate_token(id,securityKey,None)
                    data = {
                        "authToken": authToken,
                        'status': True
                    }
                    resp = jsonify(data)
                    resp.status_code = 200
                    return resp
                else: 
                    resp = jsonify({'message': 'Authentication failed (incorrect password)', "status": False})
                    resp.status_code = 200
                    return resp
            elif not isEmailVerify:
                resp = jsonify({'message': 'Authentication failed (user is not verified)', "status": False})
                resp.status_code = 200
                return resp
        else:
            resp = jsonify({'message': 'Authentication failed (user not found)', "status": False})
            resp.status_code = 200
            return resp
    except:
        resp = jsonify({"message": 'Authentication failed (user not found)', "status": False})
        resp.status_code = 200
        return resp


#delete user by delete method
def deleteUserbyId(id):
    try:
        if myCol.find_one({'_id': id}):
            # Delete the user with the custom ID
            myCol.delete_one({'_id': id})
            resp = jsonify({'message': 'User deleted successfully', 'status': True})
            resp.status_code = 200
            return resp
        else:
            return jsonify({'message': 'User not found', 'status': False}),404

    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}")
        return resp 

    
#route for reset password
def verify():
    try:
        token = request.args.get('token')
        data= generate_authtoken.decode_token(token,securityKey)
        id = data['id']
        password = data['password']
        user = myCol.find_one({'_id': id})
        isEmailVerify = user['isEmailVerify']
        if user and isEmailVerify:
            hash_password = generate_password_hash(password,method='sha256')
            filter_criteria = {"_id": id}
            update_query = {"$unset": {"token": 1},
                            "$set": {"password": hash_password}}
            myCol.update_one(filter_criteria, update_query)
            return render_template('resetpass.html')
        else:
            return jsonify({'message': 'something wents wrong', 'status': False})
    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}"),404
        return resp
    
#route for reset password
def resetpassword():
    try:
        _json = request.json
        email = _json.get('email')
        password = _json.get('password')
        user = myCol.find_one({'email': email})
        if user and user['isEmailVerify']:
                token = generate_authtoken.generate_token(user['_id'],securityKey,password)
                print(token)
                filter_criteria = {"_id": user['_id']}
                update_query = {"$set": {"token": token}}
                myCol.update_one(filter_criteria, update_query)
                sender_email = os.getenv("sender_email")
                gmailpassword = os.getenv("password")
                recipient_email = email

                subject = 'Reset password'
                body = f'Click https://takemyattendence-27rl.onrender.com/verifyreset?token='+token+ ' to reset password.'
                send = send_gmail.send_otp_email(sender_email, gmailpassword, recipient_email, subject, body)

                if send:
                    resp = jsonify({'message': 'Link sent successfully', "status": True})
                    resp.status_code = 200
                    return resp
                else:
                    return jsonify({'message': 'Failed to send Link', "status": False}), 404
        else:
            return jsonify({'message': 'User not found'})
    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}"),404
        return resp
    
#route for resend otp
def resendotp():
    try:
        _json = request.json
        email = _json.get('email')
        user = myCol.find_one({'email': email})
        if user:
            if not user['isEmailVerify']:
                sender_email = os.getenv("sender_email")
                gmailpassword = os.getenv("password")
                recipient_email = email
                otp = int(send_gmail.generate_otp())
                subject = 'Your OTP Code'
                body = f'Your OTP code is: {otp}'
                send = send_gmail.send_otp_email(sender_email, gmailpassword, recipient_email, subject, body)

                if send:
                    filter_criteria = {"_id": user['_id']}
                    update_query = {"$set": {"otp": otp}}
                    myCol.update_one(filter_criteria, update_query)
                    resp = jsonify({'message': 'OTP sent successfully!', "status": True})
                    resp.status_code = 200
                    return resp
                else:
                    return jsonify({'message': 'Failed to send OTP', "status": False}), 404
            else:
                return jsonify({'message': 'User already verified', "status": False}), 404
        else:
            return jsonify({'message': 'User not found', "status": False}), 404
    except (ValueError, TypeError) as e:
    # Handle multiple exceptions
        resp = jsonify(f"Exception: {e}"),404
        return resp
    
print(check_password_hash("sha256$hi9bLHf0y97hilwN$43dca750bb716f429d76647697d187ac1bf86396888da0d1777524fe6ee4cced","am3123"))