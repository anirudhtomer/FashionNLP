'''
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///F:\\work\\liir.susana/NLPImageSearch/liir_image_search/imgsearch.db"
db=SQLAlchemy(app)

class User(db.Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True)
    email = Column(String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username

me = User('admin', 'admin@example.com')
db.session.add(me)
db.session.commit()
'''
