'use client';

import { Player } from '@/ui/components/Player';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/v1/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("[ERROR]: Erro ao buscar ranking:", err);
      setError("Erro ao buscar ranking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (error) {
    return (
      <section id="leaderboard">
        <Container className="py-4">
          <Row>
            <Col>
              <h1 className="fw-bold text-center mb-0">Leaderboard</h1>
              <p className="text-center">Acompanhe o Leaderboard da Trivia Oktoberfest</p>
              <br />
              <p className="text-center text-danger">{error}</p>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="leaderboard">
        <Container className="py-4">
          <Row>
            <Col className="text-center">
              <h1 className="fw-bold text-center mb-0">Leaderboard</h1>
              <p className="text-center">Acompanhe o Leaderboard da Trivia Oktoberfest</p>
              <br />
              <Spinner animation="border" role="status" className="my-3">
                <span className="visually-hidden">Carregando...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section id="leaderboard">
      <Container className="py-4">
        <Row>
          <Col>
            <h1 className="fw-bold text-center mb-0">Leaderboard</h1>
            <p className="text-center">Acompanhe o Leaderboard da Trivia Oktoberfest</p>
            <br />
            {leaderboard.map((player, index) => (
              <Player key={index} player={player} index={index} />
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Leaderboard;
