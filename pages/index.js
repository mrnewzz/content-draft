import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "../styles/initialPage.module.css";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Link from "next/link";
import moment from "moment";

function Index() {
  const [postPage, setPageType] = useState(true);
  const [onPage, setOnPage] = useState("1");
  const [isLoading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [activeAlert, setAlert] = useState(false);
  const [confirmAlert, setConfirm] = useState(false);
  const [snackAlert, setSnack] = useState(false);
  const [snackMessage, setMessage] = useState("");
  const [deleteId, setId] = useState("");
  const domain = "http://dev.opensource-technology.com:3000/api";
  const url = postPage ? `${domain}/posts` : `${domain}/posts/draft`;

  async function fetchData() {
    const response = await fetch(url + `?page=1&limit=10`);
    const data = await response.json();
    setContent(data);
    setLoading(false);
  }

  async function changeType(val) {
    setPageType(val);
    setLoading(true);
    const urlChange = val ? `${domain}/posts` : `${domain}/posts/draft`;
    const response = await fetch(urlChange + `?page=1&limit=10`);
    const data = await response.json();
    setContent(data);
    setLoading(false);
  }

  async function pageChange(event, page) {
    setOnPage(page);
    updateData();
  }

  async function deleteDraft() {
    const response = await fetch(domain + `/posts/${deleteId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    decodeResponse(response);
  }

  async function patchDraft() {
    const model = { published: true };
    const response = await fetch(domain + `/posts/${deleteId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
    decodeResponse(response);
  }

  function decodeResponse(res) {
    if (res.status === 500) {
      setMessage(`พบปัญหา ${res.statusText}`);
      setSnack(true);
      setAlert(false);
      setConfirm(false);
    } else {
      setMessage('อัพเดทสำเร็จ');
      setSnack(true);
      updateData();
    }
  }

  async function updateData() {
    setLoading(true);
    const response = await fetch(url + `?page=${page}&limit=10`);
    const data = await response.json();
    setContent(data);
    setLoading(false);
  }

  function settingAlert(val, id) {
    setId(id);
    setAlert(val);
  }

  function settingConfirm(val, id) {
    setId(id);
    setConfirm(val);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box className="full-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p2">
      {/* Tabs Zone */}
      <div className={styles.between}>
        <div>
          <Button
            variant={postPage ? "contained" : "text"}
            onClick={() => (postPage ? null : changeType(true))}
          >
            Post
          </Button>
          <Button
            variant={!postPage ? "contained" : "text"}
            onClick={() => (!postPage ? null : changeType(false))}
          >
            Draft
          </Button>
        </div>
        <div>
          <Link href={`/detail?id=${"null"}`} passHref>
            <Button color="success" variant="contained">Create Draft</Button>
          </Link>
        </div>
      </div>

      {/* Content */}

      <div className="mt2">
        {content.posts.length === 0 ? (
          <>ไม่พบข้อมูล</>
        ) : (
          <>
            {content.posts.map((v, index) => {
              return (
                <div
                  key={index}
                  className={styles.myCard}
                  style={{ marginBottom: 10 }}
                >
                  <div className="p1">
                    <label className="fontMedium"> {v.title} </label>
                    <br />
                    <p> {v.content} </p>
                  </div>

                  <div className={styles.between}>
                    <div className="pl1">
                      {moment(v.created_at).format("DD-MM-yyyy HH:mm")}
                    </div>
                    <div>
                      <Link href={`/detail?id=${v.id}`} passHref>
                        <Button size="small" variant="outlined">
                          Edit
                        </Button>
                      </Link>

                      {!postPage ? (
                        <>
                          <Button
                            onClick={() => settingConfirm(true, v.id)}
                            size="small"
                            variant="outlined"
                            color="success"
                          >
                            Published
                          </Button>
                          <Button
                            onClick={() => settingAlert(true, v.id)}
                            size="small"
                            variant="outlined"
                            color="error"
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        className="mt2"
        count={content.total_page}
        page={content.page}
        onChange={pageChange}
        variant="outlined"
        shape="rounded"
      />

      <Dialog open={activeAlert} onClose={() => settingAlert(false, "")}>
        <DialogTitle>
          <label>ยืนยันการลบข้อมูล!</label>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={deleteDraft}>
            Confirm
          </Button>
          <Button onClick={() => settingAlert(false, "")} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmAlert} onClose={() => settingConfirm(false, "")}>
        <DialogTitle>
          <label>ยืนยันการ Public ข้อมูล!</label>
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={patchDraft}>
            Confirm
          </Button>
          <Button onClick={() => settingConfirm(false, "")} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackAlert}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        message={snackMessage}
      />
    </div>
  );
}

export default Index;
