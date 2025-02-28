/**
 * This server-side API route securely communicates with the AWS API
 * It keeps AWS credentials secure by only using them server-side
 */

import { NextRequest, NextResponse } from 'next/server';

// AWS SDK imports
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Create the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TOPIC_CONTENT_TABLE || 'Topics';

export async function GET(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const topicId = params.topicId;
  
  if (!topicId) {
    return NextResponse.json(
      { error: 'Topic ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Query DynamoDB for the topic
    const command = new GetCommand({
      TableName: tableName,
      Key: {
        id: topicId
      }
    });
    
    const result = await docClient.send(command);
    
    if (!result.Item) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.Item);
  } catch (error) {
    console.error('Error retrieving topic:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const topicId = params.topicId;
  
  if (!topicId) {
    return NextResponse.json(
      { error: 'Topic ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Ensure the body ID matches the URL ID
    if (body.id !== topicId) {
      return NextResponse.json(
        { error: 'Topic ID in body does not match URL' },
        { status: 400 }
      );
    }
    
    // Save to DynamoDB
    const command = new PutCommand({
      TableName: tableName,
      Item: body
    });
    
    await docClient.send(command);
    
    return NextResponse.json(
      { message: 'Topic updated successfully', id: topicId }
    );
  } catch (error) {
    console.error('Error updating topic:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  const topicId = params.topicId;
  
  if (!topicId) {
    return NextResponse.json(
      { error: 'Topic ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Delete from DynamoDB
    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        id: topicId
      }
    });
    
    await docClient.send(command);
    
    return NextResponse.json(
      { message: 'Topic deleted successfully', id: topicId }
    );
  } catch (error) {
    console.error('Error deleting topic:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}