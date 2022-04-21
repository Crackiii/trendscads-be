import app from "./app";

const server = app.listen(app.get("port"), () => {
    console.log(
        "[Trendscads Backend] is running at %d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

export default server;