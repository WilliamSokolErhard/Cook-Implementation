# IO.Swagger.Api.ClientApi

All URIs are relative to */*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ClientsClientIdJobsGet**](ClientApi.md#clientsclientidjobsget) | **GET** /clients/{clientId}/jobs | returns information about all jobs owned by client
[**ClientsClientIdJobsJobIdCancelPatch**](ClientApi.md#clientsclientidjobsjobidcancelpatch) | **PATCH** /clients/{clientId}/jobs/{jobId}/cancel | stops a running job
[**ClientsClientIdJobsJobIdDelete**](ClientApi.md#clientsclientidjobsjobiddelete) | **DELETE** /clients/{clientId}/jobs/{jobId} | stops a job if running and removes it from the server
[**ClientsClientIdJobsJobIdGet**](ClientApi.md#clientsclientidjobsjobidget) | **GET** /clients/{clientId}/jobs/{jobId} | returns information about job with given id
[**ClientsClientIdJobsJobIdReportGet**](ClientApi.md#clientsclientidjobsjobidreportget) | **GET** /clients/{clientId}/jobs/{jobId}/report | returns an extensive job report
[**ClientsClientIdJobsJobIdRunPatch**](ClientApi.md#clientsclientidjobsjobidrunpatch) | **PATCH** /clients/{clientId}/jobs/{jobId}/run | starts a previously created job
[**JobPost**](ClientApi.md#jobpost) | **POST** /job | creates a new job
[**RecipesGet**](ClientApi.md#recipesget) | **GET** /recipes | returns a list with information about all available processing recipes
[**RecipesRecipeIdGet**](ClientApi.md#recipesrecipeidget) | **GET** /recipes/{recipeId} | returns an individual recipe

<a name="clientsclientidjobsget"></a>
# **ClientsClientIdJobsGet**
> List<JobInfo> ClientsClientIdJobsGet (string clientId)

returns information about all jobs owned by client

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsGetExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier

            try
            {
                // returns information about all jobs owned by client
                List&lt;JobInfo&gt; result = apiInstance.ClientsClientIdJobsGet(clientId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsGet: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 

### Return type

[**List<JobInfo>**](JobInfo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="clientsclientidjobsjobidcancelpatch"></a>
# **ClientsClientIdJobsJobIdCancelPatch**
> void ClientsClientIdJobsJobIdCancelPatch (string clientId, string jobId)

stops a running job

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsJobIdCancelPatchExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier
            var jobId = jobId_example;  // string | a job's unique identifier

            try
            {
                // stops a running job
                apiInstance.ClientsClientIdJobsJobIdCancelPatch(clientId, jobId);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsJobIdCancelPatch: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 
 **jobId** | **string**| a job&#x27;s unique identifier | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="clientsclientidjobsjobiddelete"></a>
# **ClientsClientIdJobsJobIdDelete**
> void ClientsClientIdJobsJobIdDelete (string clientId, string jobId)

stops a job if running and removes it from the server

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsJobIdDeleteExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier
            var jobId = jobId_example;  // string | a job's unique identifier

            try
            {
                // stops a job if running and removes it from the server
                apiInstance.ClientsClientIdJobsJobIdDelete(clientId, jobId);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsJobIdDelete: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 
 **jobId** | **string**| a job&#x27;s unique identifier | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="clientsclientidjobsjobidget"></a>
# **ClientsClientIdJobsJobIdGet**
> JobInfo ClientsClientIdJobsJobIdGet (string clientId, string jobId)

returns information about job with given id

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsJobIdGetExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier
            var jobId = jobId_example;  // string | a job's unique identifier

            try
            {
                // returns information about job with given id
                JobInfo result = apiInstance.ClientsClientIdJobsJobIdGet(clientId, jobId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsJobIdGet: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 
 **jobId** | **string**| a job&#x27;s unique identifier | 

### Return type

[**JobInfo**](JobInfo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="clientsclientidjobsjobidreportget"></a>
# **ClientsClientIdJobsJobIdReportGet**
> JobReport ClientsClientIdJobsJobIdReportGet (string clientId, string jobId)

returns an extensive job report

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsJobIdReportGetExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier
            var jobId = jobId_example;  // string | a job's unique identifier

            try
            {
                // returns an extensive job report
                JobReport result = apiInstance.ClientsClientIdJobsJobIdReportGet(clientId, jobId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsJobIdReportGet: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 
 **jobId** | **string**| a job&#x27;s unique identifier | 

### Return type

[**JobReport**](JobReport.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="clientsclientidjobsjobidrunpatch"></a>
# **ClientsClientIdJobsJobIdRunPatch**
> void ClientsClientIdJobsJobIdRunPatch (string clientId, string jobId)

starts a previously created job

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class ClientsClientIdJobsJobIdRunPatchExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var clientId = clientId_example;  // string | a client's unique identifier
            var jobId = jobId_example;  // string | a job's unique identifier

            try
            {
                // starts a previously created job
                apiInstance.ClientsClientIdJobsJobIdRunPatch(clientId, jobId);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.ClientsClientIdJobsJobIdRunPatch: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **string**| a client&#x27;s unique identifier | 
 **jobId** | **string**| a job&#x27;s unique identifier | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="jobpost"></a>
# **JobPost**
> void JobPost (JobOrder body = null)

creates a new job

Creates a new job and an associated temporary folder for file exchange. After creation, the temp folder can be accessed via WebDAV at '/{jobId}' 

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class JobPostExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var body = new JobOrder(); // JobOrder |  (optional) 

            try
            {
                // creates a new job
                apiInstance.JobPost(body);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.JobPost: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**JobOrder**](JobOrder.md)|  | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="recipesget"></a>
# **RecipesGet**
> List<RecipeInfo> RecipesGet ()

returns a list with information about all available processing recipes

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RecipesGetExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();

            try
            {
                // returns a list with information about all available processing recipes
                List&lt;RecipeInfo&gt; result = apiInstance.RecipesGet();
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.RecipesGet: " + e.Message );
            }
        }
    }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List<RecipeInfo>**](RecipeInfo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
<a name="recipesrecipeidget"></a>
# **RecipesRecipeIdGet**
> Recipe RecipesRecipeIdGet (string recipeId)

returns an individual recipe

### Example
```csharp
using System;
using System.Diagnostics;
using IO.Swagger.Api;
using IO.Swagger.Client;
using IO.Swagger.Model;

namespace Example
{
    public class RecipesRecipeIdGetExample
    {
        public void main()
        {
            var apiInstance = new ClientApi();
            var recipeId = recipeId_example;  // string | a recipe's unique identifier

            try
            {
                // returns an individual recipe
                Recipe result = apiInstance.RecipesRecipeIdGet(recipeId);
                Debug.WriteLine(result);
            }
            catch (Exception e)
            {
                Debug.Print("Exception when calling ClientApi.RecipesRecipeIdGet: " + e.Message );
            }
        }
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recipeId** | **string**| a recipe&#x27;s unique identifier | 

### Return type

[**Recipe**](Recipe.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)
