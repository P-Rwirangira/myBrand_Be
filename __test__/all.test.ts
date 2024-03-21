import { test, it, describe, expect, beforeAll, afterAll, jest } from '@jest/globals';
import superTest, { Request, Response } from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path'

console.log('__dirname:', __dirname);

const MONGO_URL='mongodb+srv://shebz:shebz123@cluster0.iwskxk4.mongodb.net/testsDB?retryWrites=true&w=majority';
const token: { token: string } = { token: '' };
const token2: { token2: string } = { token2: '' };
const  blogId: {blogID: string } = {blogID: ''};
const msgId: {msgId: string} = { msgId: ''}; 
const subId: {subId: string} = { subId: ''};

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(MONGO_URL);
  await mongoose.connection.db.dropDatabase();
}, 50000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("endpoints", () => {
  it('should return 404', async () => {
    const response = await superTest(app)
    .get('/*');
    expect(response.statusCode).toBe(404);
  });
  
  it('should give 201 for account creation', async () => {
    const response = await superTest(app)
      .post('/signup')
      .send({
        username: 'Musabe',
        password: 'musabe123',
        email: 'musabe@gmail.com',
      });
    expect(response.statusCode).toBe(201);
  });
  
 
  it('Logging in', async () => {
    const response = await superTest(app)
      .post('/login')
      .send({
        username: 'Musabe',
        password: 'musabe123'
      });
    token2.token2 = response.body.token;
    expect(response.statusCode).toBe(200);
  });
 
  it('should give 404 for already saveds', async () => {
    const response = await superTest(app)
      .post('/signup')
      .send({
        username: 'Musabe',
        password: 'musabe123',
        email: 'musabe@gmail.com',
      });
    expect(response.statusCode).toBe(400);
  });
  
  it('creating  admin', async () => {
    const response = await superTest(app)
      .post('/signup')
      .send({
        email:'shebelle@gmail.com',
        password: 'shebelle123',
        role: 'admin'
      });
    token.token = response.body.token;
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });
  

  it('Logging in', async () => {
    const response = await superTest(app)
      .post('/login')
      .send({
        email: 'Spinnal',
        password: 'Spinnal123',
      });
    token.token = response.body.token;
    expect(response.statusCode).toBe(200);
  });
  
  it('Logging in validation error', async () => {
    const response = await superTest(app)
      .post('/login')
      .send({
        username: 's',
        password: 'shebelle123'
      });
    expect(response.statusCode).toBe(401);
  });
    it('Logging in doesnot exist', async () => {
    const response = await superTest(app)
      .post('/login')
      .send({
        username: 'Doesnotexist',
        password: 'passwordnot',
      });
    expect(response.statusCode).toBe(401);
  });


});


describe('blog test',()=>{
      it('Posting a blog missing image..500', async () => {
    const res = await superTest(app)
      .post('/blogs')
      .send({
        title: "Testingg12",
        content: "blog created in testing",
      })
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(500);
  });
  it('should create a blog with an image', async () => {
    const formData = new FormData();
    formData.append('title', 'Test Blog');
    formData.append('content', 'This is a test blog with an image');
    const imagePath = path.join(__dirname, '..', 'random.jpg');
   
    console.log('Resolved imagePath:', imagePath);

    formData.append('image', fs.createReadStream(imagePath));
  
    const response = await superTest(app)
      .post('/blogs')
      .set('Authorization', 'Bearer ' + token.token)
      .attach('image', fs.readFileSync(imagePath), 'random.jpg')
      .field('title', 'Test Blog')
      .field('content', 'This is a test blog with an image');
  
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Blog created successfully!!');
    expect(response.body).toHaveProperty('savedBlog');
    expect(response.body.savedBlog).toHaveProperty('_id');
    expect(response.body.savedBlog).toHaveProperty('title', 'Test Blog');
    expect(response.body.savedBlog).toHaveProperty('content', 'This is a test blog with an image');
    expect(response.body.savedBlog).toHaveProperty('image');
    expect(response.body.savedBlog).toHaveProperty('likes', 0);
    expect(response.body.savedBlog).toHaveProperty('comments');
    expect(response.body.savedBlog.comments).toHaveLength(0);

    blogId.blogID = response.body.savedBlog._id; 
}, 60000);

it('should return 200..Posting a comment', async () => {
  const res = await superTest(app)
    .post(`/blogs/${blogId.blogID}/comment`)
    .send({
      email: "theemail@gmail.com",
      comment: "thecomment of test",
    })
    .set('Authorization', 'Bearer ' + token.token);
  expect(res.statusCode).toBe(200);
});


      it('Posting a blog error 400', async () => {
    const res = await superTest(app)
      .post('/blogs')
      .send({
        title: "",
        content: "",
      })
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(400);
  });

  it('editing a blog', async () => {
    const res = await superTest(app)
        .patch(`/blogs/${blogId.blogID}`)
        .send({
        content: "Testing update",
        })
        .set('Authorization', 'Bearer ' + token.token);
    expect(res.body.message).toContain('Blog updated!')
    });


      it('should be 200..get a blog', async () => {
    const res = await superTest(app)
      .get(`/blogs/${blogId.blogID}`)
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(200);
  });
  
  it('get a blog error', async () => {
    const res = await superTest(app)
      .get('/blogs/65e37915dfd0ff9a6ec1815')
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(500);
  });

    
  it('should give 401..deleting a blog', async () => {
    const res = await superTest(app)
      .delete(`/blogs/${blogId.blogID}`)
    expect(res.statusCode).toBe(401);
  });

    

  it('error Posting a comment..400 validation', async () => {
    const res = await superTest(app)
      .post(`/blogs/${blogId.blogID}/comment`)
      .send({
        comment: "like this",
      })
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(400);
  });

  it('should be unothorized... Posting a comment', async () => {
    const res = await superTest(app)
      .post(`/blogs/${blogId.blogID}/comment`)
      .send({
        email: "she@gmail.com",
        comment: "like this",
      })
    expect(res.statusCode).toBe(401);
  });
  it('should give 200..deleting a blog', async () => {
    const res = await superTest(app)
      .delete(`/blogs/${blogId.blogID}`)
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(200);
  });

});


describe("messages",()=>{
      it('should give 400 ..create a message', async () => {
    const response = await superTest(app)
      .post('/messages')
      .send({
        title: 'v',
        email: 'ddssgmail.com',
        message: 'the message send',
      });
    expect(response.statusCode).toBe(400);
  });
  it('should send a message', async () => {
    const response = await superTest(app)
      .post('/messages')
      .send({
        title: 'petero',
        email: 'petero@gmail.com',
        message: 'Testing queries',
      });
    expect(response.statusCode).toBe(201);
    msgId.msgId=response.body.Query._id;
  });

    it('should be..unauthorized', async () => {
    const res = await superTest(app)
      .get('/messages')
      .set('Authorization', 'Bearer ' + token2.token2);
    expect(res.body.message).toContain('Unauthorized access');
  });

  it('should give 404 ..notfound', async () => {
    const res = await superTest(app)
      .get('/messages/655ddfbcc954392f2eeda438')
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(404);
  });
  it('should give 401 ..get a msg unouthorised', async () => {
    const res = await superTest(app)
      .get(`/messages/${msgId.msgId}`)
    expect(res.statusCode).toBe(401);
  });
  console.log(`the message id ${msgId.msgId}`)
  it('should give 200..deleting a message', async () => {
    const res = await superTest(app)
      .delete(`/messages/${msgId.msgId}`)
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(200);
  });


})

describe("liking",() =>{
    
  it('should give 500 ..Liking', async () => {
    const res = await superTest(app)
      .post(`/blogs/${blogId.blogID}/like`)
      .send({
        name: "mudanago",
        email: "likingemail@gmail.com",
      })
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(500);
  });
  it('Liking....200', async () => {
    const res = await superTest(app)
      .post(`/blogs/${blogId.blogID}/like`)
      .send({
        email:"musabe@gmail.com",
        postId:`${blogId.blogID}`
      })
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(200);
  });
  
  it('Liking....401', async () => {
    const res = await superTest(app)
    .post(`/blogs/${blogId.blogID}/like`)
    .send({
      email:"musabe@gmail.com",
      postId:`${blogId.blogID}`
    })
    expect(res.statusCode).toBe(401);
  });


})
   //  server file
   describe("server file tests ", () => {

    it('should start the server', async () => {
        const server = await app.listen(6000);
        expect(server).toBeDefined();
        server.close();
    });
});
// subscribers

describe("subs part",()=>{

 
  it('should give 201 and return the correct response format', async () => {
    const response = await superTest(app)
      .post('/subs')
      .send({
        email: 'dds@gmail.com'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('subscriber');
    expect(response.body.subscriber).toHaveProperty('_id');
    expect(response.body.subscriber).toHaveProperty('email');
    expect(response.body).toHaveProperty('message', 'Subscriber added successfully');
    subId.subId=response.body.subscriber._id;
  });

  it('should give error ..create a sub with same email', async () => {
    const response = await superTest(app)
      .post('/subs')
      .send({
        email: 'dds@gmail.com'
      });
    expect(response.statusCode).toBe(400);
    
  });
  
  it('should give 400 ..create a sub with invalid email', async () => {
    const response = await superTest(app)
      .post('/subs')
      .send({
        email: 'ddssgmail.com'
      });
    expect(response.statusCode).toBe(400);
  });
    it('should be..unauthorized', async () => {
    const res = await superTest(app)
      .get('/subs')
      .set('Authorization', 'Bearer ' + token2.token2);
    expect(res.body.message).toContain('Unauthorized access');
  });
  it('should return "Subscriber not found" ', async () => {
    const res = await superTest(app)
      .get('/subs/65f59462db95259dc06c2f71')
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.body.error).toBe('Subscriber not found');
  });
  
  it('should return an array with properties', async () => {
    const res = await superTest(app)
      .get('/subs')
      .set('Authorization', 'Bearer ' + token.token);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((subscriber: any) => { 
      expect(subscriber).toHaveProperty('_id');
      expect(subscriber).toHaveProperty('email');
    });
  });
  
  it('should give 404 ..notfound', async () => {
    const res = await superTest(app)
      .get('/subs/655ddfbcc954392f2eeda438')
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(404);
  });
  it('should give 401 ..get a sub unouthorised', async () => {
    const res = await superTest(app)
      .get(`/subs/${subId.subId}`)
    expect(res.statusCode).toBe(401);
  });
  it('should give 200 ..delete', async () => {
    const res = await superTest(app)
      .delete(`/subs/${subId.subId}`)
      .set('Authorization', 'Bearer ' + token.token);
    expect(res.statusCode).toBe(200);
  });
})






