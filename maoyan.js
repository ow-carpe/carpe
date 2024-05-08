const url = $request.url;
const body = $response.body;

if (url.includes("https://yanchu.maoyan.com/myshow/ajax/v2/performance")) {
    try {
        const data = JSON.parse(body);
        if (data && Array.isArray(data.data)) {
            data.data.forEach(item => {
                if (item.saleStatus === 5) {
                    item.saleStatus = 3;
                }
            });
            $done({ body: JSON.stringify(data) });
        }
    } catch (error) {
        console.log("Error:", error.message);
    }
} else {
    $done({});
}
