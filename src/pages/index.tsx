import type { NextPage } from "next";
import Head from "next/head";
import Uppy from '@uppy/core'
import { Dashboard } from '@uppy/react'
import AwsS3 from "@uppy/aws-s3";
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/progress-bar/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/file-input/dist/style.css'

const uppy = new Uppy({
  id: "uppyUploader"
})
  .use(AwsS3, {
    async getUploadParameters(file) {
      // Send a request to our API signing endpoint.
      const response = await fetch('/api/get-presigned-url', {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        // We need to parse file type because we have to generate the full url of the file
        // meaning we also need to decide on a new name for the file to be saved as.
        // Usually you use UUIDs for that, but you still need the file type 
        // e.g. https://www.smth.com/images/image123.jpeg
        body: JSON.stringify({
          fileType: file.type,
        }),
      })

      const resBody = await response.json()

      // Return an object in the correct shape.
      return {
        method: resBody.method,
        url: resBody.url,
        headers: {
          // I think these permissions should be here but you try without it
          'x-amz-acl': 'public-read',
        }
      }
    }
  })

const Home: NextPage = () => {
  const handleUpload = async () => {
    const uploadRes = await uppy.upload()
    console.log(uploadRes)
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 mb-8">
          Upload test <span className="text-purple-300">DigitalOcean Spaces</span>
        </h1>
        <div className="flex justify-center items-center flex-col gap-4">

          <Dashboard uppy={uppy} />

          <button type="button" onClick={handleUpload}
            className="bg-purple-600 text-white hover:bg-purple-800 px-8 py-3 rounded-lg">
            Upload
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;

