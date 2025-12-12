// javascript
                    import React from "react";
                    import {Badge, Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";

                    export default function ProfileCard({ username, connected, roomsCount, usersCount, onNewDM, onToggleDark }) {
                        const avatarLetter = username?.[0]?.toUpperCase() || "?";

                        return (
                            <Card className="profile-card mb-3">
                                <CardBody >
                                    <Row className="d-flex align-items-center w-100">
                                      <Col md={4}
                                        className="avatar me-3 flex-shrink-0">
                                        {avatarLetter}
                                      </Col>
                                      <Col md={8} className="">
                                        <div className="d-flex align-items-center flex-nowrap">
                                          <CardTitle className="mb-0 me-2">{username}</CardTitle>
                                          <small className="text-muted">
                                            {connected ? <Badge color="success">Online</Badge> : <Badge color="secondary">Offline</Badge>}
                                          </small>
                                        </div>
                                        <div className="d-flex ms-3">
                                          {/*<Button color="secondary" size="sm" onClick={onToggleDark}>Toggle Dark</Button>*/}
                                        </div>
                                      </Col>
                                    </Row>
                                </CardBody>
                                <div className="p-3 border-top d-flex justify-content-between small text-muted">
                                    <div>Rooms: <strong>{roomsCount}</strong></div>
                                    <div>Users: <strong>{usersCount}</strong></div>
                                </div>
                            </Card>
                        );
                    }