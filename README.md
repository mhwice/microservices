To get started locally, first ensure that you have Docker, Kubernetes, and Skaffold installed.

```
skaffold dev
```

To view our application code in dev mode we need to be able to go to something like localhost:1234 in our browser. We cannot do this in Kubernetes as there is no 'localhost'. Instead we can tell Kubernetes to output to something like mysite.com and then on our machine we can set a configuration so that when we navigate to mysite.com we are actually shown our local 127.0.0.1 instead of the real mysite.com. To get this done, open your /etc/hosts file (its a file not a folder) and add:

```
127.0.0.1 mysite.com
```

or whatever site you want. Then in your `ingress-srv.yaml` file just make sure that the host is set to this site. This is how NGINX knows where to send traffic.


Used:

https://skaffold.dev
https://kubernetes.github.io/ingress-nginx/
