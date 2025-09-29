const About = () => {
  return(
    <section id="about">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-12">
            <h1 className="fw-bold mb-0">Sobre</h1>
            <p className="mb-4">Sobre o <span className="fw-bold">Trivia Oktoberfest</span></p>
            <hr />

            <div className="card mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-1">Descrição</h6>
                <hr/>
                <p><span className="fw-bold">Trivia Oktoberfest</span> Trata-se de uma <span className="fw-bold">Alexa Skill </span>
                em formato de Quizz focado inteiramente no cenário da Oktoberfest, propondo aos
                jogadores uma experiencia imersiva em um jogo de perguntas e respostas sobre
                <span className="fw-bold"> Oktoberfest</span> e a <span className="fw-bold">Cultura Alemã</span></p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h6 className="fw-bold mb-1">Desenvolvedor(a)</h6>
                <hr />
                <p>
                  <span className="fw-bold">SQUARE Inc, </span>
                  Renato Rosa Franco, Hanzo Kimura
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h6 className="fw-bold mb-1">Versão</h6>
                <hr />
                <p>
                  <span className="badge text-bg-secondary">
                    1.1.0
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About;
