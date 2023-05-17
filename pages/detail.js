import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/router";

function DraftDetail() {
  const [isLoading, setLoading] = useState(false);
  const [saveLoading, setSaveLoad] = useState(false);
  const modelDefault = { title: "", content: "" };
  const [model, setModel] = useState(modelDefault);
  const [snackAlert, setSnack] = useState(false);
  const [snackMessage, setMessage] = useState("");
  const router = useRouter();
  const query = router.query.id;
  const domain = "http://dev.opensource-technology.com:3000/api/posts";

  async function fetchData() {
    setLoading(true);
    const response = await fetch(domain + `/${query}`);
    const data = await response.json();
    setModel(data);
    setLoading(false);
  }

  function inputForm(e) {
    const { name, value } = e.target;
    setModel((prevState) => ({ ...prevState, [name]: value }));
  }

  async function onSave() {
    if (model.title === "" || model.content === "") {
      setMessage("กรุณากรอกข้อมูล title");
      setSnack(true);
    } else {
      setSaveLoad(true);
      const url = query !== "null" ? domain + `/${query}` : domain;
      const actionType = query !== "null" ? "PATCH" : "POST";
      const response = await fetch(url, {
        method: actionType,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });
      decodeResponse(response);
    }
  }

  async function onPublish() {
    if (model.published) {
      setMessage("ข้อมูล published เรียบร้อยแล้ว");
      setSnack(true);
    } else {
      setSaveLoad(true);
      const model = { published: true };
      const response = await fetch(domain + `/${query}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });
      decodeResponse(response);
    }
  }

  async function decodeResponse(res) {
    if (res.status === 500) {
      setMessage(`พบปัญหา ${res.statusText}`);
      setSnack(true);
      setSaveLoad(false);
    } else {
      //  complete save
      setMessage("อัพเดทข้อมูลสำเร็จ");
      setSnack(true);
      setSaveLoad(false);
      if (query === "null") router.back();
    }
  }

  useEffect(() => {
    if (query !== "null") fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box className="full-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      className="p2"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h2 className="fontMedium">Title</h2>
      <input
        onChange={inputForm}
        value={model.title}
        type="text"
        name="title"
        placeholder="ข้อมูล title"
        style={{ height: "20px" }}
      />
      <h2 className="fontMedium">Content</h2>
      <textarea
        value={model.content}
        onChange={inputForm}
        rows="4"
        type="text"
        name="content"
        placeholder="ข้อมูล content"
      />
      <div
        className="mt2"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
      >
        <Button
          style={{ width: "200px" }}
          color="primary"
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          style={{ width: "200px" }}
          color="error"
          variant="contained"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
      <div
        className="mt2"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          style={{ width: "500px" }}
          color="success"
          variant="contained"
          disabled={query === "null" ? true : false}
          onClick={onPublish}
        >
          Publish Now
        </Button>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saveLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackAlert}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message={snackMessage}
      />
    </div>
  );
}

export default DraftDetail;
