using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using UnityEngine;
using UnityEngine.Networking;
using Random = System.Random;


#region JSON Data Types
[Serializable]
public struct POST
{
    public string id;
    public string name;
    public string clientId;
    public string recipeId;
    public Parameters parameters;
    public string priority;
    public string submission;
}
[Serializable]
public struct Parameters
{
    public string highPolyMeshFile;
    public int numFaces;
    public string tool;
}

[Serializable]
public struct GET
{
    public Result result;   
}
[Serializable]
public struct Result
{
    public Steps steps;
}
[Serializable]
public struct Steps
{
    public Delivery delivery;
}
[Serializable]
public struct Delivery
{
    public Result2 result;
}
[Serializable]
public struct Result2
{
    public Files files;
}
[Serializable]
public struct Files
{
    public string decimatedMeshFile;
}
#endregion

public class CookDemoScript : MonoBehaviour
{
    public string baseDir = "";
    // Start is called before the first frame update
    void Awake()
    {
        try
        {
#if WINDOWS_UWP
StorageFolder storageFolder = ApplicationData.Current.LocalFolder;

baseDir = storageFolder.Path.Replace('\\', '/') + "/";
#endif

#if UNITY_EDITOR
            baseDir = Application.streamingAssetsPath.Replace('\\', '/') + "/";
#endif
        }
        catch (Exception e)
        {
            Debug.LogError(e);
        }

        StartCoroutine(JobSystem());
    }


    IEnumerator JobSystem()
    {

        Random random = new Random();
        long num = random.Next(10000000,1000000000);
        string JobID = num.ToString("X");

        //string JobID = "de5dcff2-ef61-9afa-7ef0-1fe864e30b77";
        string CID = "6867a59e-0ec5-411d-a93e-4f8cd9098823";
        var post = new POST()
        {
            id = JobID,
            name = "decimate",
            clientId = CID,
            recipeId = "7ce5c5b1-00d2-4d7f-bebc-ea99ae5f6640",
            parameters = new Parameters() {
                highPolyMeshFile = baseDir + "test-43k.fbx",//File.ReadAllBytes(baseDir+"test.FBX"),
                numFaces = 13245,
                tool = "Meshlab"
            },
            priority = "normal",
            submission = "2018-08-27T16:33:45.853Z",
        };
        var jsonData = JsonUtility.ToJson(post);
        Debug.Log(jsonData);

        //Initialize Job and send file
        using (UnityWebRequest www = UnityWebRequest.Post("http://127.0.0.1:8000/job", jsonData))
        {
            www.SetRequestHeader("content-type", "application/json");
            www.method = UnityWebRequest.kHttpVerbPOST;
            www.uploadHandler.contentType = "application/json";
            www.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(jsonData));

            print(System.Text.Encoding.UTF8.GetString(www.uploadHandler.data));
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log(www.error);
            }
            else
            {
                print(www.responseCode); 
                print(www.error);
            }

        }

        //Start and run Job
        using (UnityWebRequest www = new UnityWebRequest("http://127.0.0.1:8000/clients/" + CID + "/jobs/" + JobID + "/run"))
        {
            www.method = "PATCH";
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log(www.error);
            }
            else
            {
                print(www.responseCode); 
                print(www.error);
            }

        }


        //Check every second to get the name of the completed file
        string returningFileName = "";
        while (returningFileName == "" || returningFileName==null)
        {
            yield return new WaitForSecondsRealtime(1f);
            using (UnityWebRequest www = UnityWebRequest.Get("http://127.0.0.1:8000/clients/" + CID + "/jobs/" + JobID + "/report"))
            {
                yield return www.SendWebRequest();

                if (www.isNetworkError)
                {
                    Debug.Log(www.error);
                }
                else
                {
                    print(www.responseCode); 
                    print(www.error);
                    if (www.isDone)
                    {
                        var result = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
                        result = "{\"result\":" + result + "}";
                        print(result);
                        var get = JsonUtility.FromJson<GET>(result);
                        returningFileName = get.result.steps.delivery.result.files.decimatedMeshFile;
                        print(returningFileName);
                    }
                    else
                    {
                        Debug.Log("Error! data couldn't get.");
                    }
                }

            }
        }

        //Downloading and saving of the completed file in /StreamingAssets/
        using (UnityWebRequest www = UnityWebRequest.Get("http://127.0.0.1:8000/" + JobID + "/"+returningFileName))
        {
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log(www.error);
            }
            else
            {
                print(www.responseCode);
                print(www.error);
                if (www.isDone)
                {
                    File.WriteAllBytes(baseDir + returningFileName, www.downloadHandler.data);
                    var result = System.Text.Encoding.UTF8.GetString(www.downloadHandler.data);
                    //result = "{\"result\":" + result + "}";
                    print(result);
                }
                else
                {
                    Debug.Log("Error! data couldn't get.");
                }
            }

        }

        //Deletion of the project off the server
        using (UnityWebRequest www = UnityWebRequest.Delete("http://127.0.0.1:8000/clients/" + CID + "/jobs/" + JobID))
        {
            yield return www.SendWebRequest();

            if (www.isNetworkError)
            {
                Debug.Log(www.error);
            }
            else
            {
                print(www.responseCode);
                print(www.error);                
            }

        }
    }

    //IO.Swagger.Client.APIClient.PrepareRequest();
    //StartCoroutine(GetWeather(success =>
    //{
    //    print(success);
    //}));


    //List<IMultipartFormSection> formData = new List<IMultipartFormSection>();
    //formData.Add(new MultipartFormFileSection("id", "7fa4db4c-4cd7-44d7-b37d-937cdada1663"));
    //formData.Add(new MultipartFormFileSection("name", "Decimate mesh"));
    //formData.Add(new MultipartFormFileSection("clientId", "e201f3b6-9d2d-4f13-822a-11c65341a250"));
    //formData.Add(new MultipartFormFileSection("recipeId", "7ce5c5b1-00d2-4d7f-bebc-ea99ae5f6640"));
    //formData.Add(new MultipartFormFileSection("parameters", "myfile.txt"));
    //formData.Add(new MultipartFormFileSection("priority", "normal"));
    //formData.Add(new MultipartFormFileSection("submission", "2018-08-27T16:33:45.853Z"));

    //print(formData);
    //UnityWebRequest www = UnityWebRequest.Post("127.0.0.1:8000", formData);
    //yield return www.Send();

    //if (www.isNetworkError)
    //{
    //    Debug.Log(www.error);
    //}
    //else
    //{
    //    Debug.Log("Form upload complete!");
    //}

    //Dictionary<string, string> input = new Dictionary<string, string>();
    //input.Add("id", "7fa4db4c-4cd7-44d7-b37d-937cdada1663");
    //input.Add("name", "Decimate mesh");
    //input.Add("clientId", "6867a59e-0ec5-411d-a93e-4f8cd9098823");
    //input.Add("recipeId", "7ce5c5b1-00d2-4d7f-bebc-ea99ae5f6640	");
    //print("highPolyMeshFile\": " + File.ReadAllBytes(baseDir + "test.FBX") + ",\n\"numFaces: " + 10000);
    //input.Add("parameters", "\"highPolyMeshFile\": " + "\"test.FBX\"" + ",\"numFaces\": " + 10000);
    //input.Add("priority", "normal");
    //input.Add("submission", "2018-08-27T16:33:45.853Z");
    //UnityWebRequest www = POST("127.0.0.1:8000", input, success =>
    //{
    //    print(success);
    //});

    //private string results;

    //public String Results
    //{
    //    get
    //    {
    //        return results;
    //    }
    //}

    //public UnityWebRequest GET(string url, Action<string> onComplete)
    //{

    //    UnityWebRequest www = new UnityWebRequest(url);
    //    StartCoroutine(WaitForRequest(www, onComplete));
    //    return www;
    //}

    //public UnityWebRequest POST(string url, Dictionary<string, string> post, Action<string> onComplete)
    //{
    //    WWWForm form = new WWWForm();

    //    foreach (KeyValuePair<string, string> post_arg in post)
    //    {
    //        form.AddField(post_arg.Key, post_arg.Value);
    //    }

    //    //Byte[] temp = System.Text.Encoding.UTF8.GetBytes("{ \"id\": \"7fa4db4c-4cd7-44d7-b37d-937cdada1663\", \"name\": \"Decimate mesh\", \"clientId\": \"e201f3b6-9d2d-4f13-822a-11c65341a250\", \"recipeId\": \"be8c1ebc-3b2c-4cef-bd9a-14782624c931\",\"parameters\": {          \"highPolyMeshFile\": \"mymesh.obj\",    \"numFaces\": 150000 }, \"priority\": \"normal\", \"submission": \"2018-08-27T16:33:45.853Z\"}");
    //    print(System.Text.Encoding.UTF8.GetString(form.data));
    //    UnityWebRequest www = UnityWebRequest.Post(url, form);

    //    StartCoroutine(WaitForRequest(www, onComplete));
    //    return www;
    //}

    //private IEnumerator WaitForRequest(UnityWebRequest www, Action<string> onComplete)
    //{
    //    yield return www;
    //    // check for errors
    //    if (www.error == null)
    //    {
    //        print(www.downloadedBytes.ToString());
    //        results = www.downloadHandler.ToString();
    //        onComplete(results);
    //    }
    //    else
    //    {
    //        Debug.Log(www.error);
    //    }
    //}

    //private GET GetData()
    //{
    //    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(String.Format("http://127.0.0.1:8000"));
    //    HttpWebResponse response = (HttpWebResponse)request.GetResponse();
    //    StreamReader reader = new StreamReader(response.GetResponseStream());
    //    string jsonResponse = reader.ReadToEnd();
    //    GET info = JsonUtility.FromJson<GET>(jsonResponse);
    //    return info;
    //}

    //IEnumerator GetWeather(Action<GET> onSuccess)
    //{
    //    using (UnityWebRequest req = UnityWebRequest.Get(String.Format("http://127.0.0.1:8000")))
    //    {
    //        yield return req.Send();
    //        while (!req.isDone)
    //            yield return null;
    //        byte[] result = req.downloadHandler.data;
    //        string weatherJSON = System.Text.Encoding.Default.GetString(result);
    //        print(weatherJSON);
    //        GET info = JsonUtility.FromJson<GET>(weatherJSON);
    //        onSuccess(info);
    //    }
    //}
}
