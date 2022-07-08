Industrial Lead Source
======================

A javascript helper library for marketing attribution. The library will parse [utm parameters](https://support.google.com/analytics/answer/103386) from the url or set them to appropriate values and 
store them in browser cookies for use on current and subsequent page views.

It's up to the developer to retrieve information from the stored cookies and send it to third-party systems. 

A typical use case is to retrieve the stored values and inject them into hidden form fields for storing lead attribution with a form submission.


UTM Url Params
-----------

These utm url params are stored:
- utm_source (may be set automatically to one of 'Direct' )
- utm_campaign
- utm_medium 
- utm_content
- utm_term

If no utm parameters are present when the page loads, default values for `utm_source` and `utm_medium` will be used based on presence of an
[http referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) and whether it's a known search engine of note or not.  

### Usage:

Include javascript library in your page: 

Initialize (DomContentLoaded or similar)
```
var ils = new IndustrialLeadSource(document);
```

Getting values out
```
var ils = new IndustrialLeadSource(document);
var values = ils.getStoredValues();//object with utm_campaign, utm_source... etc. properties.
```


 The following cookie values are stored based:
 
- ils_utm_medium
- ils_utm_source
- ils_utm_campaign
- ils_utm_term
- ils_visit (this is session cookie)

---

See this diagram for how utm params are parsed or set to default values based on referrer.

![Parsing Diagram](support/industrial-lead-source-diagram.svg?raw=true "Title")