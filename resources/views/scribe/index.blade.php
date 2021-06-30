<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Laravel Documentation</title>

    <link href="https://fonts.googleapis.com/css?family=PT+Sans&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset("vendor/scribe/css/theme-default.style.css") }}" media="screen">
    <link rel="stylesheet" href="{{ asset("vendor/scribe/css/theme-default.print.css") }}" media="print">
    <script src="{{ asset("vendor/scribe/js/theme-default-3.3.0.js") }}"></script>

    <link rel="stylesheet"
          href="//unpkg.com/@highlightjs/cdn-assets@10.7.2/styles/obsidian.min.css">
    <script src="//unpkg.com/@highlightjs/cdn-assets@10.7.2/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>

    <script src="//cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>
    <script>
        var baseUrl = "http://localhost";
    </script>
    <script src="{{ asset("vendor/scribe/js/tryitout-3.3.0.js") }}"></script>

</head>

<body data-languages="[&quot;bash&quot;,&quot;javascript&quot;]">
<a href="#" id="nav-button">
      <span>
        MENU
        <img src="{{ asset("vendor/scribe/images/navbar.png") }}" alt="navbar-image" />
      </span>
</a>
<div class="tocify-wrapper">
                <div class="lang-selector">
                            <a href="#" data-language-name="bash">bash</a>
                            <a href="#" data-language-name="javascript">javascript</a>
                    </div>
        <div class="search">
        <input type="text" class="search" id="input-search" placeholder="Search">
    </div>
    <ul class="search-results"></ul>

    <ul id="toc">
    </ul>

            <ul class="toc-footer" id="toc-footer">
                            <li><a href="{{ route("scribe.postman") }}">View Postman collection</a></li>
                            <li><a href="{{ route("scribe.openapi") }}">View OpenAPI spec</a></li>
                            <li><a href="http://github.com/knuckleswtf/scribe">Documentation powered by Scribe ✍</a></li>
                    </ul>
            <ul class="toc-footer" id="last-updated">
            <li>Last updated: June 27 2021</li>
        </ul>
</div>
<div class="page-wrapper">
    <div class="dark-box"></div>
    <div class="content">
        <h1>Introduction</h1>
<p>This documentation aims to provide all the information you need to work with our API.</p>
<aside>As you scroll, you'll see code examples for working with the API in different programming languages in the dark area to the right (or as part of the content on mobile).
You can switch the language used with the tabs at the top right (or from the nav menu at the top left on mobile).</aside>
<blockquote>
<p>Base URL</p>
</blockquote>
<pre><code class="language-yaml">http://localhost</code></pre>

        <h1>Authenticating requests</h1>
<p>This API is not authenticated.</p>

        <h1 id="endpoints">Endpoints</h1>
    <p>
        
    </p>

            <h2 id="endpoints-GETapi-user">GET api/user</h2>

<p>
</p>



<blockquote>Example request:</blockquote>


<pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/user" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre>

<pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/user"
);

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre>

            <blockquote>
            <p>Example response (401):</p>
        </blockquote>
                <details class="annotation">
            <summary>
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre>
            <code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code>
            </pre>
        </details>         <pre>
                <code class="language-json">

{
    &quot;message&quot;: &quot;Unauthenticated.&quot;
}
 </code>
        </pre>
    <div id="execution-results-GETapi-user" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-user"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-user"></code></pre>
</div>
<div id="execution-error-GETapi-user" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-user"></code></pre>
</div>
<form id="form-GETapi-user" data-method="GET"
      data-path="api/user"
      data-authed="0"
      data-hasfiles="0"
      data-headers='{"Content-Type":"application\/json","Accept":"application\/json"}'
      onsubmit="event.preventDefault(); executeTryOut('GETapi-user', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-user"
                    onclick="tryItOut('GETapi-user');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-user"
                    onclick="cancelTryOut('GETapi-user');" hidden>Cancel
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-user" hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/user</code></b>
        </p>
                    </form>

        <h1 id="user-management">User Management</h1>
    <p>
        <p>API untuk pengaturan user</p>
    </p>

            <h2 id="user-management-GETapi-admin-getAllUser">Get All User</h2>

<p>
<small class="badge badge-darkred">requires authentication</small>
</p>

<p>Mendapatkan semua user</p>

<blockquote>Example request:</blockquote>


<pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/admin/getAllUser" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre>

<pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/admin/getAllUser"
);

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre>

            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary>
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre>
            <code class="language-http">cache-control: no-cache, private
content-type: application/json
x-ratelimit-limit: 60
x-ratelimit-remaining: 59
access-control-allow-origin: *
 </code>
            </pre>
        </details>         <pre>
                <code class="language-json">

[
    {
        &quot;id&quot;: 1,
        &quot;name&quot;: &quot;dsfsdfdd&quot;,
        &quot;username&quot;: &quot;sdfsdfsd&quot;,
        &quot;is_active&quot;: 1
    },
    {
        &quot;id&quot;: 3,
        &quot;name&quot;: &quot;Chesa&quot;,
        &quot;username&quot;: &quot;chesa&quot;,
        &quot;is_active&quot;: 1
    },
    {
        &quot;id&quot;: 4,
        &quot;name&quot;: &quot;jlskdjlskfj&quot;,
        &quot;username&quot;: &quot;sadasjd&quot;,
        &quot;is_active&quot;: 1
    },
    {
        &quot;id&quot;: 5,
        &quot;name&quot;: &quot;sjdfdk&quot;,
        &quot;username&quot;: &quot;dslkfjkdslqjdsfk&quot;,
        &quot;is_active&quot;: 1
    }
]
 </code>
        </pre>
    <div id="execution-results-GETapi-admin-getAllUser" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-admin-getAllUser"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-admin-getAllUser"></code></pre>
</div>
<div id="execution-error-GETapi-admin-getAllUser" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-admin-getAllUser"></code></pre>
</div>
<form id="form-GETapi-admin-getAllUser" data-method="GET"
      data-path="api/admin/getAllUser"
      data-authed="1"
      data-hasfiles="0"
      data-headers='{"Content-Type":"application\/json","Accept":"application\/json"}'
      onsubmit="event.preventDefault(); executeTryOut('GETapi-admin-getAllUser', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-admin-getAllUser"
                    onclick="tryItOut('GETapi-admin-getAllUser');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-admin-getAllUser"
                    onclick="cancelTryOut('GETapi-admin-getAllUser');" hidden>Cancel
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-admin-getAllUser" hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/admin/getAllUser</code></b>
        </p>
                <p>
            <label id="auth-GETapi-admin-getAllUser" hidden>Authorization header:
                <b><code>Bearer </code></b><input type="text"
                                                                name="Authorization"
                                                                data-prefix="Bearer "
                                                                data-endpoint="GETapi-admin-getAllUser"
                                                                data-component="header"></label>
        </p>
                </form>

            <h2 id="user-management-POSTapi-admin-addUser">Add user</h2>

<p>
<small class="badge badge-darkred">requires authentication</small>
</p>

<p>Menambahkan user baru</p>

<blockquote>Example request:</blockquote>


<pre><code class="language-bash">curl --request POST \
    "http://localhost/api/admin/addUser?username=eum&amp;name=delectus&amp;password=nobis&amp;isActive=1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre>

<pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/admin/addUser"
);

let params = {
    "username": "eum",
    "name": "delectus",
    "password": "nobis",
    "isActive": "1",
};
Object.keys(params)
    .forEach(key =&gt; url.searchParams.append(key, params[key]));

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

fetch(url, {
    method: "POST",
    headers,
}).then(response =&gt; response.json());</code></pre>

            <blockquote>
            <p>Example response (200, success{):</p>
        </blockquote>
                <pre>
                <code class="language-json">

&quot;id&quot;: 5,
 &quot;name&quot; : &quot;Fulan bin Fulanah&quot;,
 &quot;username&quot; : &quot;fulan&quot;,
}
 </code>
        </pre>
            <blockquote>
            <p>Example response (422{):</p>
        </blockquote>
                <pre>
                <code class="language-json">

&quot;id&quot;: &quot;Harus diisi&quot;,
 &quot;name&quot; : &quot;Harus diisi&quot;,
 &quot;username&quot; : &quot;Harus diisi&quot;,
}
 </code>
        </pre>
    <div id="execution-results-POSTapi-admin-addUser" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-admin-addUser"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-admin-addUser"></code></pre>
</div>
<div id="execution-error-POSTapi-admin-addUser" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-admin-addUser"></code></pre>
</div>
<form id="form-POSTapi-admin-addUser" data-method="POST"
      data-path="api/admin/addUser"
      data-authed="1"
      data-hasfiles="0"
      data-headers='{"Content-Type":"application\/json","Accept":"application\/json"}'
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-admin-addUser', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-admin-addUser"
                    onclick="tryItOut('POSTapi-admin-addUser');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-admin-addUser"
                    onclick="cancelTryOut('POSTapi-admin-addUser');" hidden>Cancel
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-admin-addUser" hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/admin/addUser</code></b>
        </p>
                <p>
            <label id="auth-POSTapi-admin-addUser" hidden>Authorization header:
                <b><code>Bearer </code></b><input type="text"
                                                                name="Authorization"
                                                                data-prefix="Bearer "
                                                                data-endpoint="POSTapi-admin-addUser"
                                                                data-component="header"></label>
        </p>
                    <h4 class="fancy-heading-panel"><b>Query Parameters</b></h4>
                    <p>
                <b><code>username</code></b>&nbsp;&nbsp;<small>string</small>  &nbsp;
<input type="text" name="username" data-endpoint="POSTapi-admin-addUser" data-component="query" required  hidden>
<br>
<p>username user baru. harus unique</p>            </p>
                    <p>
                <b><code>name</code></b>&nbsp;&nbsp;<small>string</small>  &nbsp;
<input type="text" name="name" data-endpoint="POSTapi-admin-addUser" data-component="query" required  hidden>
<br>
<p>nama lengkap user baru</p>            </p>
                    <p>
                <b><code>password</code></b>&nbsp;&nbsp;<small>string</small>  &nbsp;
<input type="text" name="password" data-endpoint="POSTapi-admin-addUser" data-component="query" required  hidden>
<br>
<p>password dalam plain text minimal 8 karakter</p>            </p>
                    <p>
                <b><code>isActive</code></b>&nbsp;&nbsp;<small>boolean</small>  &nbsp;
<label data-endpoint="POSTapi-admin-addUser" hidden><input type="radio" name="isActive" value="1" data-endpoint="POSTapi-admin-addUser" data-component="query" required ><code>true</code></label>
<label data-endpoint="POSTapi-admin-addUser" hidden><input type="radio" name="isActive" value="0" data-endpoint="POSTapi-admin-addUser" data-component="query" required ><code>false</code></label>
<br>
<p>status keaktivan user</p>            </p>
                </form>

            <h2 id="user-management-POSTapi-admin-editUser">Edit user</h2>

<p>
<small class="badge badge-darkred">requires authentication</small>
</p>

<p>API untuk mengedit user</p>

<blockquote>Example request:</blockquote>


<pre><code class="language-bash">curl --request POST \
    "http://localhost/api/admin/editUser?id=7&amp;username=veniam&amp;name=eum&amp;isActive=1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre>

<pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/admin/editUser"
);

let params = {
    "id": "7",
    "username": "veniam",
    "name": "eum",
    "isActive": "1",
};
Object.keys(params)
    .forEach(key =&gt; url.searchParams.append(key, params[key]));

let headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

fetch(url, {
    method: "POST",
    headers,
}).then(response =&gt; response.json());</code></pre>

            <blockquote>
            <p>Example response (200, success{):</p>
        </blockquote>
                <pre>
                <code class="language-json">

&quot;id&quot;: 5,
 &quot;name&quot; : &quot;Fulan bin Fulanah&quot;,
 &quot;username&quot; : &quot;fulan&quot;,
}
 </code>
        </pre>
            <blockquote>
            <p>Example response (404{):</p>
        </blockquote>
                <pre>
                <code class="language-json">

&quot;message&quot; : &quot;User tidak ditemukan&quot;
}
 </code>
        </pre>
            <blockquote>
            <p>Example response (422{):</p>
        </blockquote>
                <pre>
                <code class="language-json">

&quot;id&quot;: &quot;Harus diisi&quot;,
 &quot;name&quot; : &quot;Harus diisi&quot;,
 &quot;username&quot; : &quot;Harus diisi&quot;,
}
 </code>
        </pre>
    <div id="execution-results-POSTapi-admin-editUser" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-admin-editUser"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-admin-editUser"></code></pre>
</div>
<div id="execution-error-POSTapi-admin-editUser" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-admin-editUser"></code></pre>
</div>
<form id="form-POSTapi-admin-editUser" data-method="POST"
      data-path="api/admin/editUser"
      data-authed="1"
      data-hasfiles="0"
      data-headers='{"Content-Type":"application\/json","Accept":"application\/json"}'
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-admin-editUser', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-admin-editUser"
                    onclick="tryItOut('POSTapi-admin-editUser');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-admin-editUser"
                    onclick="cancelTryOut('POSTapi-admin-editUser');" hidden>Cancel
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-admin-editUser" hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/admin/editUser</code></b>
        </p>
                <p>
            <label id="auth-POSTapi-admin-editUser" hidden>Authorization header:
                <b><code>Bearer </code></b><input type="text"
                                                                name="Authorization"
                                                                data-prefix="Bearer "
                                                                data-endpoint="POSTapi-admin-editUser"
                                                                data-component="header"></label>
        </p>
                    <h4 class="fancy-heading-panel"><b>Query Parameters</b></h4>
                    <p>
                <b><code>id</code></b>&nbsp;&nbsp;<small>integer</small>  &nbsp;
<input type="number" name="id" data-endpoint="POSTapi-admin-editUser" data-component="query" required  hidden>
<br>
<p>id user berdasarkan database</p>            </p>
                    <p>
                <b><code>username</code></b>&nbsp;&nbsp;<small>string</small>  &nbsp;
<input type="text" name="username" data-endpoint="POSTapi-admin-editUser" data-component="query" required  hidden>
<br>
<p>username user baru. harus unique</p>            </p>
                    <p>
                <b><code>name</code></b>&nbsp;&nbsp;<small>string</small>  &nbsp;
<input type="text" name="name" data-endpoint="POSTapi-admin-editUser" data-component="query" required  hidden>
<br>
<p>nama lengkap user baru</p>            </p>
                    <p>
                <b><code>isActive</code></b>&nbsp;&nbsp;<small>boolean</small>  &nbsp;
<label data-endpoint="POSTapi-admin-editUser" hidden><input type="radio" name="isActive" value="1" data-endpoint="POSTapi-admin-editUser" data-component="query" required ><code>true</code></label>
<label data-endpoint="POSTapi-admin-editUser" hidden><input type="radio" name="isActive" value="0" data-endpoint="POSTapi-admin-editUser" data-component="query" required ><code>false</code></label>
<br>
<p>status keaktivan user</p>            </p>
                </form>

    

        
    </div>
    <div class="dark-box">
                    <div class="lang-selector">
                                    <a href="#" data-language-name="bash">bash</a>
                                    <a href="#" data-language-name="javascript">javascript</a>
                            </div>
            </div>
</div>
<script>
    $(function () {
        var exampleLanguages = ["bash","javascript"];
        setupLanguages(exampleLanguages);
    });
</script>
</body>
</html>