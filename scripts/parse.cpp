#include <QCoreApplication>
#include <QString>
#include <QStringList>
#include <QFile>
#include <QTextStream>
#include <QVector>
#include <QMap>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QFile inputFile("universitieslist.txt");
    QMap<QString, QVector<QString> > univ;

    if (inputFile.open(QIODevice::ReadOnly))
    {
       QTextStream in(&inputFile);
       while ( !in.atEnd() )
       {
          QString line = in.readLine();
          QStringList s = line.split("-", QString::SkipEmptyParts);

          QString acronym = s[0].trimmed();
          QString name = s[1].trimmed();

          univ[name].append(acronym);

       }
    }

    inputFile.close();

    QFile outputFile("univout.txt");
    if (outputFile.open(QIODevice::WriteOnly))
    {
        QTextStream out(&outputFile);
        QMap<QString,QVector<QString> >::iterator it;
        for (it = univ.begin(); it != univ.end(); it++)
        {
            out << "{\"name\": \"" << QString(it.key()) << "\", \"acronym\": [\"";
            for (int vc = 0; vc < it.value().size(); vc++)
            {
                out << QString(it.value().at(vc));
                if (vc < it.value().size() - 1)
                    out << "\", \"";
            }
            out << "\"]}";
            out << endl;
        }
    }

    outputFile.close();

    exit(0);
    return a.exec();
}
