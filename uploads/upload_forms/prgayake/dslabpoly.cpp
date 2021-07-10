#include<iostream>
#include<cstring>

using namespace std;

class node
{	
	public:
		node * next;
		int expo;
		int coeff;

};

class poly
{
	node *head;
	public:
		poly()
		{
			head=NULL;
		}

		

		void create()
		{
			node*temp,*p;
			int ch=1;

			
			do{
				temp =new(node);
				cout<<"\nEnter the Coefficent";
				cin>>temp->coeff;
				cout<<"\nEnter the Exponent";
				cin>>temp->expo;
				temp->next=temp;

			if(head==NULL)
			{
				head=temp;
			}

			else
			{
				p=head;

				while(p->next!=head)
				{
					p=p->next;
				}

					p->next=temp;
					temp->next=head;

			}
		
		
			cout<<"Do you want to continue (1/0)";
			cin>>ch;
		}
			while(ch!=0);
	
}

		void display()
		{
			node *p;
	
			p=head;

		do
		{
		cout<<p->coeff<<"X^"<<p->expo<<" +";
		p=p->next;
		}while(p!=head);

		

		}


		void add()
		{
			node* temp1,*p1,*p2;


		while(p1 && p2)
		{
			if(p1->next==NULL || p->next==NULL)
			{
				cour<<"polynoial is empty";

			}
			else if(p1->expo > p2->expo)
			{
				temp->coeff = p1->coeff;
				temp->expo = p1-> expo;
				p1=p1->next;
			}

			else if(p1->expo<p2->expo)
			{
				temp->coeff = p2->coeff;
				temp->expo = p2-> expo;
				p2=p2->next;
			}

			else
			{
				temp->coeff=p1->coeff+p2->coeff;
				temp ->expo=p1->expo;
				p2=p2->next;
			}
		}
	}

};

int main()
{
	poly p1;
	p1.create();
	p1.display();

	return 0;
}








