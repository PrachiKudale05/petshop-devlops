
import json
import boto3
import uuid
from datetime import datetime

# DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('PetOrders')

# Polly
polly = boto3.client('polly')

# S3
s3 = boto3.client('s3')

# Your existing website bucket
AUDIO_BUCKET = "petshop-static-web-devlops"

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])

        print("Received:", body)

        # Generate Order ID
        order_id = str(uuid.uuid4())
        print("Generated order_id:", order_id)

        # Store in DynamoDB
        item = {
            'orderId': order_id,
            'customerName': body['customerName'],
            'phone': body['phone'],
            'address': body['address'],
            'cartItems': body['cartItems'],
            'total': str(body['total']),
            'orderDate': datetime.now().isoformat()
        }

        print("ITEM:", item)

        response = table.put_item(Item=item)

        print("DynamoDB Response:", response)

        # Prepare ordered items text
        ordered_items = []

        for cart_item in body['cartItems']:
            ordered_items.append(
                f"{cart_item['quantity']} {cart_item['name']}"
            )

        items_text = ", ".join(ordered_items)

        # Polly message
        speech_text = f"""
        Hello {body['customerName']}.

        Thank you for shopping at Pet Shop.

        You have ordered {items_text}.

        The total bill amount is {body['total']} rupees.

        Thank you and have a wonderful day.
        """

        # Generate speech
        polly_response = polly.synthesize_speech(
            Text=speech_text,
            OutputFormat='mp3',
            VoiceId='Aditi'
        )

        # Read MP3 stream
        audio_stream = polly_response['AudioStream'].read()

        # Store inside audio folder
        file_name = f"audio/{order_id}.mp3"

        s3.put_object(
            Bucket=AUDIO_BUCKET,
            Key=file_name,
            Body=audio_stream,
            ContentType='audio/mpeg'
        )

        # Audio URL
        audio_url = (
            f"https://{AUDIO_BUCKET}.s3.ap-south-1.amazonaws.com/"
            f"audio/{order_id}.mp3"
        )

        return {
            'statusCode': 200,
            'headers': {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            'body': json.dumps({
                'message': 'Order placed successfully',
                'orderId': order_id,
                'audioUrl': audio_url
            })
        }

    except Exception as e:
        print("ERROR:", str(e))

        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*"
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
